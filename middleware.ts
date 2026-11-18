import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accountRoute = path.startsWith("/account/dashboard") || path.startsWith("/account/bookings") || path.startsWith("/account/profile");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    if (!accountRoute && !path.startsWith("/admin")) return NextResponse.next({ request });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/account/login";
    loginUrl.searchParams.set("next", path);
    loginUrl.searchParams.set("reason", "auth-unavailable");
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  if ((accountRoute || path.startsWith("/admin")) && !signedIn) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/account/login";
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin") && signedIn) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      const accountUrl = request.nextUrl.clone();
      accountUrl.pathname = "/account/dashboard";
      accountUrl.search = "";
      return NextResponse.redirect(accountUrl);
    }
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
