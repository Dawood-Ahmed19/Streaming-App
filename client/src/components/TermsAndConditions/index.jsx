import { Link } from "react-router-dom";

const TermsAndConditions = ({ checked, onChange }) => {
  return (
    <div className="flex items-start gap-2">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
      />
      <label htmlFor="terms" className="text-sm text-muted">
        I agree to the{" "}
        <Link to="/terms" className="text-accent hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
      </label>
    </div>
  );
};

export default TermsAndConditions;
