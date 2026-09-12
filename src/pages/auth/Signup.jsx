import AuthLayout from "../../components/auth/AuthLayout";

function Signup() {
  return (
    <AuthLayout>
      <h1 className="text-center text-[21px] font-extrabold">
        Create your account
      </h1>

      <p className="mt-1.5 text-center text-sm text-(--mycircle-muted)">
        One space for you and the people you share your life with.
      </p>
    </AuthLayout>
  );
}

export default Signup;