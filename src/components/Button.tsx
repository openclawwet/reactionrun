import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ActionButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | ActionButtonProps;

const getClassName = (variant: BaseProps["variant"], className?: string) =>
  ["button", `button-${variant ?? "primary"}`, className]
    .filter(Boolean)
    .join(" ");

export function Button(props: LinkButtonProps): ReactNode;
export function Button(props: ActionButtonProps): ReactNode;
export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    const { children, className, href, variant = "primary", ...rest } = props;

    return (
      <a className={getClassName(variant, className)} href={href} {...rest}>
        <span className="button-label">{children}</span>
      </a>
    );
  }

  const buttonProps = props as ActionButtonProps;
  const {
    children,
    className,
    type = "button",
    variant = "primary",
    ...rest
  } = buttonProps;

  return (
    <button
      className={getClassName(variant, className)}
      type={type}
      {...rest}
    >
      <span className="button-label">{children}</span>
    </button>
  );
}
