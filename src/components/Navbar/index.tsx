"use client"

import Input from "@/components/Input/index"
import styles from "./index.module.scss"
import { Power, Search } from "lucide-react"
import { AuthService } from "@/services/authService"
import { useAtomValue } from "jotai"
import { userAtom } from "@/store"
import Link from "next/link"
import ProfileImage from "../ProfileImage"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { PageLink } from "@/constants/PageLink"

export default function Navbar() {
  const user = useAtomValue(userAtom)

  const profileButtonRef = useRef<HTMLDivElement>(null)
  const dropdownMenuRef = useRef<HTMLUListElement>(null)
  const [dropdownActive, setDropdownActive] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function logout() {
    AuthService.logout()
  }

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>Logo</div>

      <div className={styles.topControls}>
        <Input
          className={styles.searchbar}
          prefix={<Search className={styles.searchLogo} />}
          placeholder="Search"
        />

        <div>
          <div className={styles.test}>
            <div
              ref={profileButtonRef}
              onClick={() => setDropdownActive(!dropdownActive)}
              className={styles.profileButton}
            >
              <ProfileImage url={user?.profileImage} />
            </div>

            <ul
              ref={dropdownMenuRef}
              className={clsx(
                styles.dropdownMenu,
                !dropdownActive && styles.hideDropdownMenu
              )}
            >
              <li className={styles.menuItem}>
                <Link className={styles.user} href={PageLink.userProfile}>
                  {<ProfileImage url={user?.profileImage} />}
                  <div className={styles.userInformation}>
                    {user?.name} {user?.surname}
                    <div>{user?.email}</div>
                  </div>
                </Link>
              </li>
              <li onClick={logout} className={styles.menuItem}>
                <Power />
                Log out
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
