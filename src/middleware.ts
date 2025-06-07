import { PageLink } from "@/constants/PageLink"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = [PageLink.login, PageLink.register]

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const token = req.cookies.get("access-token")?.value

  if (token && PUBLIC_PATHS.includes(url.pathname.replace(/\/$/, ""))) {
    url.pathname = PageLink.dashboard
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
