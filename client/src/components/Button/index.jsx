const Button = ({
  label,
  children,
  type = "submit",
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-accent text-text hover:shadow-lg hover:shadow-red-500/20",
    secondary: "bg-surface text-text border border-line hover:border-text/30",
  };

  return (
    <button
      type={type}
      className={`w-full cursor-pointer rounded-lg py-4 text-lg transition-all
        disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children ?? label}
    </button>
  );
};

export default Button;
