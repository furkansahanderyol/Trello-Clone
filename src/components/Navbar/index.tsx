"use client"

import Input from "@/components/Input/index"
import styles from "./index.module.scss"
import { Power, Search } from "lucide-react"
import { AuthService } from "@/services/authService"
import { useAtom, useAtomValue } from "jotai"
import { dragActiveAtom, notificationAtom, userAtom } from "@/store"
import Link from "next/link"
import ProfileImage from "../ProfileImage"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { PageLink } from "@/constants/PageLink"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"

export default function Navbar() {
  const user = useAtomValue(userAtom)
  const [dragActive] = useAtom(dragActiveAtom)

  const profileButtonRef = useRef<HTMLDivElement>(null)
  const dropdownMenuRef = useRef<HTMLUListElement>(null)
  const [dropdownActive, setDropdownActive] = useState(false)
  const [notification] = useAtom(notificationAtom)

  useOnClickOutside(dropdownMenuRef, () => setDropdownActive(false))

  async function logout() {
    AuthService.logout()
  }

  return (
    <nav className={clsx(styles.container, dragActive && styles.dragActive)}>
      <Link href={PageLink.dashboard} className={styles.logo}>
        Logo
      </Link>

      <div className={styles.topControls}>
        <Input
          className={styles.searchbar}
          prefix={<Search className={styles.searchLogo} />}
          placeholder="Search"
        />

        <div className={styles.notificationsWrapper}>
          <div className={styles.notifications}></div>
          <div className={styles.notificationsDropdown}></div>
        </div>

        <div className={styles.profileWrapper}>
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
    </nav>
  )
}
