import { authMiddleware } from "@clerk/nextjs";
import { debug } from "console";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/privacy",
    "/terms",
    "/sign-in",
    "/sign-up",
    "/about",
    "/beta",
    "/api/(.*)",
    "/api/webhooks(.*)",
  ],
  debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
