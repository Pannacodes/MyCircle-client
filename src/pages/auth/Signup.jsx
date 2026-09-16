import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout";
import { AuthContext } from "../../context/auth.context";

function Signup() {
  const { signupUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    let hasError = false;

    if (!username) {
      setUsernameError("Please enter a username.");
      hasError = true;
    }

    if (!email) {
      setEmailError("Please enter your email.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter a password.");
      hasError = true;
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, and one number.",
      );
      hasError = true;
    }
    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);

      await signupUser(username, email, password);

      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em]">
          Create your account
        </h1>

        <p className="mt-2 text-[14px] leading-6 text-(--mycircle-muted)">
          One space for you and the people you share your life with.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-[13px] font-semibold"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Choose a username"
            className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-[14px] outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
          />
          {usernameError && (
            <p className="mt-1.5 text-[12px] text-(--mycircle-error)">
              {usernameError}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[13px] font-semibold"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-[14px] outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
          />
          {emailError && (
            <p className="mt-1.5 text-[12px] text-(--mycircle-error)">
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[13px] font-semibold"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            className="h-11 w-full rounded-xl border border-(--mycircle-border) bg-(--mycircle-surface) px-3.5 text-[14px] outline-none placeholder:text-(--mycircle-muted) focus:border-(--mycircle-primary) focus:ring-2 focus:ring-(--mycircle-primary-tint)"
          />
          {passwordError && (
            <p className="mt-1.5 text-[12px] text-(--mycircle-error)">
              {passwordError}
            </p>
          )}
        </div>

        {/* Error */}
        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-(--mycircle-error)/20 bg-(--mycircle-error)/10 px-3 py-2.5 text-[13px] text-(--mycircle-error)"
          >
            {errorMessage}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl bg-(--mycircle-primary) px-4 text-[14px] font-semibold text-white transition-colors hover:bg-(--mycircle-primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-[13px] text-(--mycircle-muted)">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-(--mycircle-primary) hover:text-(--mycircle-primary-hover)"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;
