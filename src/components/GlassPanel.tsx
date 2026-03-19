import type { HTMLAttributes, ReactNode } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassPanel({
  children,
  className,
  ...rest
}: GlassPanelProps) {
  return (
    <div className={["glass-panel", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
