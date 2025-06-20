import { PageLink } from "@/constants/PageLink"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = [PageLink.login, PageLink.register]
const PROTECTED_PATHS = [
  PageLink.changePassword,
  PageLink.dashboard,
  PageLink.registerSuccess,
  PageLink.userProfile,
]

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const token = req.cookies.get("access-token")?.value
  const pathname = url.pathname.replace(/\/$/, "")

  if (!token && PROTECTED_PATHS.includes(pathname)) {
    url.pathname = PageLink.login
    return NextResponse.redirect(url)
  }

  if (token && PUBLIC_PATHS.includes(pathname)) {
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
