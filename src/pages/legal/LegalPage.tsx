import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import type { LegalBlock, LegalDoc } from "./types";

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * "Entire Agreement. These Terms..." -> bold "Entire Agreement." then the rest.
 * Only for a short Title-Case lead-in, so ordinary sentences are left alone.
 */
function LeadIn({ text }: { text: string }) {
  const match = /^([A-Z][A-Za-z-]*(?: [A-Za-z-]+){0,3})\. (.+)$/s.exec(text);
  if (!match) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-[#0a0e14]">{match[1]}.</strong> {match[2]}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 id={slug(block.text)} className="m-0 mt-12 scroll-mt-24 text-[1.375rem] font-bold tracking-tight text-[#0a0e14] first:mt-0 sm:text-2xl">
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className="m-0 mt-7 text-[17px] font-semibold text-[#0a0e14]">{block.text}</h3>;
    case "p":
      return (
        <p className="m-0 mt-4 text-[15.5px] leading-7 text-[#3d4757]">
          <LeadIn text={block.text} />
        </p>
      );
    case "strong":
      // Long bold paragraphs are the all-caps notices; short ones are address lines.
      return block.text.length > 120 ? (
        <p className="m-0 mt-5 rounded-lg border border-[#e4ebf4] bg-[#f8fafd] p-4 text-[14px] font-semibold leading-6 text-[#2b3648] sm:p-5">
          {block.text}
        </p>
      ) : (
        <p className="m-0 mt-2 text-[15.5px] font-semibold leading-7 text-[#0a0e14]">{block.text}</p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`m-0 mt-4 grid gap-2.5 pl-6 text-[15.5px] leading-7 text-[#3d4757] ${block.ordered ? "list-decimal" : "list-disc"} marker:text-[#8a97ab]`}>
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <LeadIn text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "table":
      return (
        <div className="mt-5">
          {/* Phones: one card per row. Tablet and up: a real table. */}
          <div className="grid gap-3 md:hidden">
            {block.rows.map((row) => (
              <dl key={row.join("|")} className="m-0 rounded-lg border border-[#e4ebf4] bg-white p-4">
                {row.map((cell, i) => (
                  <Fragment key={block.head[i]}>
                    <dt className={`text-[12px] font-semibold uppercase tracking-wide text-[#5b6a80] ${i ? "mt-3" : ""}`}>
                      {block.head[i]}
                    </dt>
                    <dd className="m-0 mt-1 text-[15px] leading-6 text-[#2b3648]">{cell}</dd>
                  </Fragment>
                ))}
              </dl>
            ))}
          </div>
          <div className="hidden overflow-hidden rounded-lg border border-[#e4ebf4] md:block">
            <table className="w-full border-collapse text-left text-[14.5px] leading-6">
              <thead className="bg-[#f8fafd]">
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col" className="border-b border-[#e4ebf4] px-4 py-3 font-semibold text-[#0a0e14]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join("|")} className="align-top [&:not(:last-child)>td]:border-b [&>td]:border-[#e4ebf4]">
                    {row.map((cell, i) => (
                      <td key={block.head[i]} className={`px-4 py-3 text-[#3d4757] ${i === 0 ? "font-medium text-[#0a0e14]" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
  }
}

/** A Terms or Privacy page: heading, contents list (sticky beside the text on wide screens), body. */
export function LegalPage({ doc, testId, other }: { doc: LegalDoc; testId: string; other: { to: string; label: string } }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${doc.title} | Mooric ERP`;
    return () => {
      document.title = previous;
    };
  }, [doc.title]);

  const sections = doc.blocks.flatMap((b) => (b.kind === "h2" ? [b.text] : []));

  return (
    <div data-testid={testId}>
      <section className="layout-shell border-b border-[#e4ebf4] bg-[#f8fafd] py-12 sm:py-16">
        <div className="v4-rail min-w-0">
          <p className="v4-kicker">{doc.company}</p>
          <h1 className="v4-h2 break-words">{doc.title}</h1>
          <div className="mt-4 grid gap-1 text-[15px] text-[#48566b]">
            {doc.meta.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="layout-shell py-10 sm:py-14">
        <div className="v4-rail grid min-w-0 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            <details className="group rounded-lg border border-[#e4ebf4] bg-white p-4 lg:border-0 lg:p-0" open>
              <summary className="cursor-pointer list-none text-[13px] font-semibold uppercase tracking-[0.14em] text-[#5b6a80] lg:pointer-events-none">
                On this page
              </summary>
              <ol className="m-0 mt-3 grid list-none gap-1.5 p-0">
                {sections.map((text) => (
                  <li key={text}>
                    <a href={`#${slug(text)}`} className="block rounded py-0.5 text-[14px] leading-5 text-[#3d4757] hover:text-erp-600">
                      {text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>
          <article className="min-w-0 max-w-[46rem]">
            {doc.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <p className="m-0 mt-12 border-t border-[#e4ebf4] pt-6 text-[15px] text-[#48566b]">
              See also our{" "}
              <Link to={other.to} className="font-semibold text-erp-600 underline underline-offset-2 hover:text-erp-700">
                {other.label}
              </Link>
              .
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
