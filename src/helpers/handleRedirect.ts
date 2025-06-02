import Router from "next/navigation"

export function handleRedirect(page: string, ms: number) {
  return setTimeout(() => {
    Router.redirect(page)
  }, ms)
}
