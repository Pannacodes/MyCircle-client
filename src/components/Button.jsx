const variantClasses = {
  primary:
    "bg-(--mycircle-primary) text-white hover:bg-(--mycircle-primary-hover)",
  secondary:
    "bg-(--mycircle-secondary) text-white hover:brightness-95",
  ghost:
    "border border-(--mycircle-border) bg-transparent text-(--mycircle-text) hover:bg-(--mycircle-raised)",
  destructive:
    "bg-(--mycircle-error) text-white hover:brightness-95",
};

function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
