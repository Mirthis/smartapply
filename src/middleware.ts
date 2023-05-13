import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/new",
    "/privacy",
    "/terms",
    "sign-in",
    "sign-up",
    "about",
    "contact",
  ],
});

export const config = {
  matcher: ["/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)", "/'"],
};
