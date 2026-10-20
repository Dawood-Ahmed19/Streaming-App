const Input = ({
  label,
  icon,
  error,
  type = "text",
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </label>
      )}

      <div className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 focus-within:border-accent">
        {icon && (
          <span className="shrink-0 text-muted group-focus-within:text-accent">
            {icon}
          </span>
        )}
        <input
          type={type}
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
          required={required}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
};

export default Input;
