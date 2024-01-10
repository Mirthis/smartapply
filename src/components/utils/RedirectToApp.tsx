import { redirect } from "next/navigation";

const RedirectToApp = () => {
  redirect("/dashboard");
};

export default RedirectToApp;
