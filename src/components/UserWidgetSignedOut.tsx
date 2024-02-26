import Link from "next/link";

const UserWidgetSignedOut = () => {
  return (
    <div className="space-x-2">
      <Link
        className="hidden md:inline btn-link btn-primary btn no-underline"
        href="/sign-in"
      >
        Log In
      </Link>
      <Link className="btn-primary btn" href="/sign-up">
        Sign Up
      </Link>
    </div>
  );
};

export default UserWidgetSignedOut;
