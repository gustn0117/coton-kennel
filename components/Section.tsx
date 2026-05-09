import { ReactNode } from "react";

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-page px-6 lg:px-10 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-2.5 font-serif text-[17px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[20px]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
        {title}
      </h2>
    </div>
  );
}
