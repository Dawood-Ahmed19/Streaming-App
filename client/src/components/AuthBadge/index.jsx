const AuthBadge = ({ label }) => {
  return (
    <p className="auth-text text-md text-accent bg-[#31000a] border border-[#F5F5F5] rounded-full px-4 py-2 max-w-[100px] text-center">
      {label}
    </p>
  );
};

export default AuthBadge;
