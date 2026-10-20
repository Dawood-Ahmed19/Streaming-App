import { Input, TermsAndConditions, Button, AuthBadge } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = useAuthStore((s) => s.signup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (!agreed)
      return setError("Please accept the Terms of Service and Privacy Policy");

    setIsSubmitting(true);
    try {
      await signup(form);
      navigate("/explore");
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center">
      <div className="Auth-wrapper">
        <div className="flex container flex-col items-start gap-8 bg-cardBg rounded-3xl py-10 px-10">
          <div className="flex flex-col gap-2">
            <AuthBadge label="Sign Up" />
            <h1 className="text-3xl font-bold text-text">
              Create Your Account
            </h1>
            <p className="text-muted text-sm">
              Enter your Details to get started
            </p>
          </div>
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              name="username"
              placeholder="Type Your Name"
              label="NAME"
              icon={<FontAwesomeIcon icon={faUser} />}
              onChange={handleChange}
              value={form.username}
              required
            />
            <Input
              name="email"
              placeholder="Type Your Email"
              label="Email"
              type="email"
              icon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={handleChange}
              value={form.email}
              required
            />
            <Input
              name="password"
              placeholder="Type Your Password"
              label="Password"
              type="password"
              icon={<FontAwesomeIcon icon={faLock} />}
              onChange={handleChange}
              value={form.password}
              required
            />
            <TermsAndConditions
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <Button
              label={
                isSubmitting ? "Creating account..." : "Register your Account"
              }
              disabled={isSubmitting}
            />
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-sm text-muted self-center">
            Already have an account?{" "}
            <a href="/signin" className="text-text hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
