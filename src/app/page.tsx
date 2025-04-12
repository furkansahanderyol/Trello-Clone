"use client"

import Link from "next/link"
import styles from "./page.module.scss"
import { PageLink } from "@/constants/PageLink"

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className="title">Welcome to Tasky</h1>
      <div className={styles.wrapper}>
        <Link className={styles.link} href={PageLink.login}>
          Login Page
        </Link>
        <Link className={styles.link} href={PageLink.register}>
          Register Page
        </Link>
      </div>
    </main>
  )
}
