import { authMiddleware } from "@clerk/nextjs";

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
    "/profile/(.*)",
    "/dashboard",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
