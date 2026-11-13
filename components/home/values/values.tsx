import { Section } from "@/components/shared/section";
import { VALUES } from "@/data/home/landing";

export function Values() {
  return (
    <Section tone="default">
      <div className="max-w-2xl">
        <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
          {VALUES.title}
        </h2>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.items.map(({ Icon, edge, title, description }) => (
          <li key={title}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)] sm:p-6">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: edge }}
              />
              <div className="flex items-center gap-3">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: edge,
                    backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${edge} 80%, white) 0%, ${edge} 55%, color-mix(in srgb, ${edge} 84%, black) 100%)`,
                    boxShadow: `inset 0 2px 5px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.15), 0 12px 20px -10px ${edge}`,
                  }}
                >
                  <Icon className="!size-5 text-white" />
                </span>
                <h3 className="text-[15px] font-extrabold text-[#1b2330]">{title}</h3>
              </div>
              <p className="mt-3.5 text-[13px] leading-7 text-black/55">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
