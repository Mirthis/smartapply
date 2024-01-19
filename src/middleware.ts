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
  ],
  debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
