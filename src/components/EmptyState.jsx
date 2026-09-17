function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <section
      className={`flex min-h-75 items-center justify-center rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-6 py-12 ${className}`}
    >
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--mycircle-secondary-tint)">
          <Icon
            size={28}
            strokeWidth={1.8}
            className="text-(--mycircle-secondary)"
            aria-hidden="true"
          />
        </div>

        <h2 className="text-xl font-semibold">{title}</h2>

        {description && (
          <p className="mt-2 text-sm leading-6 text-(--mycircle-muted)">
            {description}
          </p>
        )}

        {action && <div className="mt-5">{action}</div>}
      </div>
    </section>
  );
}

export default EmptyState;
