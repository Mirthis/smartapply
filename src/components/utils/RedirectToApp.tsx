import { useRouter } from "next/router";

const RedirectToApp = () => {
  const router = useRouter();

  void router.replace("/dashboard");

  return null;
};

export default RedirectToApp;
