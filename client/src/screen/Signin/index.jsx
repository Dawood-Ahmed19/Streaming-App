import { Input, Button, AuthBadge } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signin = useAuthStore((s) => s.signin);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    setIsSubmitting(true);
    try {
      await signin(form);
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
          <div className="flex flex-col gap-3">
            <AuthBadge label="Sign In" />
            <h1 className="text-3xl font-bold text-text">
              Sign in to Your Account
            </h1>
            <p className="text-muted text-sm">
              Enter your Details to get started
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="Type Your Email"
              icon={<FontAwesomeIcon icon={faEnvelope} />}
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Type Your Password"
              icon={<FontAwesomeIcon icon={faLock} />}
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button
              label={isSubmitting ? "Signing in..." : "Login"}
              disabled={isSubmitting}
            />
          </form>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <p className="text-sm text-muted self-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-text hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signin;
