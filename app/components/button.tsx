import React from "react";
import Link from "next/link";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "solid" | "ghost";

type ButtonProps = {
  href: string;
  text: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  isActive?: boolean;
  noPadding?: boolean;
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  small: { height: "32px", padding: "6px 10px" },
  medium: { height: "36px", padding: "6px 12px" },
  large: { height: "44px", padding: "10px 16px" },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  solid: {
    background: "var(--Colors-Primary-Primary-1, #3CC3BA)",
    color: "var(--Colors-Text-OnPrimary, #ffffff)",
    border: "1px solid transparent",
  },
  ghost: {
    background: "transparent",
    color: "var(--Colors-Text-Primary, #0F172A)",
    border: "none",
    boxShadow: "none",
  },
};

const baseStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--Spacings-Gaps-6px, 6px)",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 550,
  fontSize: "16px",
  outline: "none",
  transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
};

const Button: React.FC<ButtonProps> = ({
  href,
  text,
  size = "medium",
  variant = "solid",
  isActive = false,
  noPadding = false,
}) => {
  const activeColor = isActive && variant === "ghost" ? "#6D7FD9" : undefined;
  const paddingOverride = noPadding && variant === "ghost" ? { paddingLeft: "0px", paddingRight: "0px" } : {};
  
  return (
    <Link href={href} aria-label={text}>
      <button
        type="button"
        style={{ 
          ...baseStyles, 
          ...sizeStyles[size], 
          ...variantStyles[variant],
          ...paddingOverride,
          ...(activeColor && { color: activeColor })
        }}
      >
        {text}
      </button>
    </Link>
  );
};

export default Button;
