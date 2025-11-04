"use client"

import Input from "@/components/Input/index"
import styles from "./index.module.scss"
import { Bell, Power, Search } from "lucide-react"
import { AuthService } from "@/services/authService"
import { useAtom, useAtomValue } from "jotai"
import {
  dragActiveAtom,
  modalContentAtom,
  notificationAtom,
  selectedWorkspaceAtom,
  userAtom,
} from "@/store"
import Link from "next/link"
import ProfileImage from "../ProfileImage"
import { useRef, useState } from "react"
import clsx from "clsx"
import { PageLink } from "@/constants/PageLink"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { timeAgo } from "@/helpers/timeAgo"
import NotificationModal from "../-Modal/NotificationModal"

export default function Navbar() {
  const user = useAtomValue(userAtom)
  const [dragActive] = useAtom(dragActiveAtom)

  const profileButtonRef = useRef<HTMLDivElement>(null)
  const dropdownMenuRef = useRef<HTMLUListElement>(null)
  const notificationsDropdownMenuRef = useRef<HTMLDivElement>(null)
  const [dropdownActive, setDropdownActive] = useState(false)
  const [notificationsDropdownActive, setNotificationsDropdownActive] =
    useState(false)
  const [notification] = useAtom(notificationAtom)
  const [, setModalContent] = useAtom(modalContentAtom)
  const [workspace] = useAtom(selectedWorkspaceAtom)

  useOnClickOutside(dropdownMenuRef, () => setDropdownActive(false))
  useOnClickOutside(notificationsDropdownMenuRef, () =>
    setNotificationsDropdownActive(false)
  )

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
          <div
            onClick={() => setNotificationsDropdownActive(true)}
            className={styles.notifications}
          >
            <Bell />
            <div className={styles.notificationsCount}>
              {notification?.count}
            </div>
          </div>
          <div
            ref={notificationsDropdownMenuRef}
            className={clsx(
              styles.notificationsDropdown,
              notificationsDropdownActive && styles.active
            )}
          >
            {notification?.notifications.map((notification) => {
              return (
                <div
                  key={notification.id}
                  className={styles.notificationWrapper}
                  onClick={() =>
                    setModalContent({
                      title: `${notification.senderName} ${notification.senderSurname}`,
                      content: (
                        <NotificationModal
                          type={notification.type}
                          message={notification.message}
                          workspaceId={notification.workspaceId}
                        />
                      ),
                      size: "l",
                    })
                  }
                >
                  <div className={styles.senderInformation}>
                    <ProfileImage url={notification?.senderProfileImage} />
                    <div className={styles.senderDetails}>
                      <div className={styles.name}>
                        {notification.senderName} {notification.senderSurname}
                      </div>
                      <div className={styles.message}>
                        {notification.message}
                      </div>
                    </div>
                  </div>
                  <div className={styles.createdAt}>
                    {timeAgo(notification.createdAt)}
                  </div>
                </div>
              )
            })}
          </div>
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
