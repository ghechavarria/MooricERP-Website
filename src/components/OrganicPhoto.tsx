export function OrganicPhoto({
  src,
  alt,
  side,
  className = "",
  eager = false,
  objectPosition = "center",
  caption,
  rip = false,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
  className?: string;
  eager?: boolean;
  objectPosition?: string;
  caption?: string;
  rip?: boolean;
}) {
  return (
    <figure className={`organic-photo organic-photo--${side} ${rip ? "organic-photo--rip" : ""} ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        className="organic-photo__img"
        style={{ objectPosition }}
        width={1600}
        height={1200}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
      {rip ? <span className="organic-photo__tint" aria-hidden /> : null}
      {caption ? <figcaption className="organic-photo__caption">{caption}</figcaption> : null}
    </figure>
  );
}
