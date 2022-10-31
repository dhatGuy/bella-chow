// middleware.ts
import { withMiddlewareAuth } from "@supabase/auth-helpers-nextjs";

export const middleware = withMiddlewareAuth({
  redirectTo: "/login",
  authGuard: {
    isPermitted: async (user) => user.user_metadata.role == "CAFE_OWNER",
    redirectTo: "/",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
