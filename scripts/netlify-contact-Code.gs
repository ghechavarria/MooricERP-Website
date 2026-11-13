// Who gets the notification emails: Project Settings > Script Properties,
// NOTIFY_TO (required for email) and NOTIFY_CC (optional, comma-separated).
// Kept out of this file because the repo is public.
function notifyTo_() {
  return PropertiesService.getScriptProperties().getProperty("NOTIFY_TO") || "";
}

function notifyCc_() {
  return PropertiesService.getScriptProperties().getProperty("NOTIFY_CC") || "";
}

// Netlify retries a notification within minutes, so a duplicate is always
// near the bottom of the sheet: only the last rows are checked.
var DUPLICATE_WINDOW_ROWS = 500;

function escapeHtml_(value) {
  var s = String(value == null ? "" : value);
  s = s.split("&").join("&amp;");
  s = s.split("<").join("&lt;");
  s = s.split(">").join("&gt;");
  s = s.split('"').join("&quot;");
  return s;
}

// Sheets runs a cell that starts with one of these as a formula. A leading
// apostrophe makes Sheets store the value as plain text instead.
function sheetText_(value) {
  var s = String(value == null ? "" : value);
  if (/^[=+\-@\t\r]/.test(s)) {
    return "'" + s;
  }
  return s;
}

function digest_(value) {
  return Utilities.base64Encode(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      String(value),
      Utilities.Charset.UTF_8
    )
  );
}

// The forward-to-sheet Netlify function adds forwardSecret to every request.
// The same value must be saved in Project Settings > Script Properties as
// FORWARD_SHARED_SECRET. Without it, every request is refused.
function hasForwardSecret_(body) {
  var expected = PropertiesService.getScriptProperties().getProperty(
    "FORWARD_SHARED_SECRET"
  );
  if (!expected || typeof body.forwardSecret != "string") {
    return false;
  }
  return digest_(body.forwardSecret) == digest_(expected);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return jsonResponse_({ ok: true, busy: true });
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var raw = "{}";
    if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }
    var body = JSON.parse(raw);
    if (!hasForwardSecret_(body)) {
      lock.releaseLock();
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }
    var fields = {};
    if (body.data) {
      fields = body.data;
    } else if (body.payload && body.payload.data) {
      fields = body.payload.data;
    }

    var fullName = fields.name || "";
    var email = fields.email || "";
    var role = fields.role || "";
    var state = fields.state || "";
    var loans = fields.loans_per_month || "";
    var message = fields.message || "";

    var submissionId = "";
    if (body.id) {
      submissionId = body.id;
    } else if (body.payload && body.payload.id) {
      submissionId = body.payload.id;
    }
    if (!submissionId) {
      submissionId =
        (body.number != null ? body.number : "") +
        "|" +
        (body.created_at || "") +
        "|" +
        email +
        "|" +
        fullName +
        "|" +
        message +
        "|" +
        role +
        "|" +
        state +
        "|" +
        loans;
    }

    // getValues() returns a stored value without its leading apostrophe, so the
    // duplicate check compares against the raw id.
    var lastRow = sheet.getLastRow();
    if (submissionId != "" && lastRow > 1) {
      var firstRow = Math.max(2, lastRow - DUPLICATE_WINDOW_ROWS + 1);
      // column H (8) holds the submission id; one column, recent rows only
      var existing = sheet.getRange(firstRow, 8, lastRow - firstRow + 1, 1).getValues();
      var i;
      for (i = 0; i < existing.length; i++) {
        var cell = existing[i][0];
        if (cell != "" && String(cell) == String(submissionId)) {
          lock.releaseLock();
          return jsonResponse_({ ok: true, duplicate: true });
        }
      }
    }

    var receivedAt = new Date();
    sheet.appendRow([
      receivedAt,
      sheetText_(fullName),
      sheetText_(email),
      sheetText_(role),
      sheetText_(state),
      sheetText_(loans),
      sheetText_(message),
      sheetText_(submissionId)
    ]);

    sendContactEmail_({
      receivedAt: receivedAt,
      fullName: fullName,
      email: email,
      role: role,
      state: state,
      loans: loans,
      message: message,
      submissionId: submissionId
    });

    lock.releaseLock();
    return jsonResponse_({ ok: true });
  } catch (err) {
    lock.releaseLock();
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function sendContactEmail_(row) {
  var to = notifyTo_();
  if (!to) {
    return;
  }

  var subject =
    "New early access request - " +
    (row.fullName || "Unknown") +
    (row.state ? " (" + row.state + ")" : "");

  var when = Utilities.formatDate(
    row.receivedAt,
    Session.getScriptTimeZone(),
    "MMM d, yyyy h:mm a z"
  );

  var labels = [
    "Name",
    "Email",
    "Role",
    "State",
    "Loans per month",
    "Message",
    "Received"
  ];
  var values = [
    row.fullName,
    row.email,
    row.role,
    row.state,
    row.loans,
    row.message,
    when
  ];

  var tableRows = "";
  var i;
  for (i = 0; i < labels.length; i++) {
    var label = escapeHtml_(labels[i]);
    var valueHtml;
    if (labels[i] == "Email" && row.email) {
      valueHtml =
        '<a href="mailto:' +
        escapeHtml_(row.email) +
        '" style="color:#1e70d6;text-decoration:none;">' +
        escapeHtml_(row.email) +
        "</a>";
    } else {
      valueHtml = escapeHtml_(values[i]).split("\n").join("<br>");
    }
    if (!valueHtml) {
      valueHtml = "-";
    }
    var bg = i % 2 == 0 ? "#f8fafc" : "#ffffff";
    tableRows =
      tableRows +
      '<tr style="background:' +
      bg +
      ';">' +
      '<td style="padding:12px 16px;font-size:13px;color:#64748b;width:160px;vertical-align:top;border-bottom:1px solid #e2e8f0;">' +
      label +
      "</td>" +
      '<td style="padding:12px 16px;font-size:14px;color:#0f172a;vertical-align:top;border-bottom:1px solid #e2e8f0;">' +
      valueHtml +
      "</td></tr>";
  }

  var html =
    '<div style="margin:0;padding:24px;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">' +
    '<tr><td style="padding:20px 24px;background:#0b1220;color:#ffffff;">' +
    '<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#94a3b8;">Mooric ERP</div>' +
    '<div style="margin-top:6px;font-size:18px;font-weight:600;color:#ffffff;">New early access request</div>' +
    "</td></tr>" +
    '<tr><td style="padding:8px 0 0;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0">' +
    tableRows +
    "</table></td></tr>" +
    '<tr><td style="padding:16px 24px 20px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">' +
    "Sent automatically from the mooricerp.com contact form. Reply to this thread or email the requester directly." +
    "</td></tr></table></div>";

  var plain =
    "New early access request\n\n" +
    "Name: " +
    (row.fullName || "") +
    "\n" +
    "Email: " +
    (row.email || "") +
    "\n" +
    "Role: " +
    (row.role || "") +
    "\n" +
    "State: " +
    (row.state || "") +
    "\n" +
    "Loans per month: " +
    (row.loans || "") +
    "\n" +
    "Message: " +
    (row.message || "") +
    "\n" +
    "Received: " +
    when +
    "\n";

  var options = {
    htmlBody: html,
    name: "Mooric ERP Website",
    replyTo: row.email || to
  };
  var cc = notifyCc_();
  if (cc) {
    options.cc = cc;
  }

  GmailApp.sendEmail(to, subject, plain, options);
}
