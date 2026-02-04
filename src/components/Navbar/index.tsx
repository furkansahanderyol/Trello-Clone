"use client"

import Input from "@/components/Input/index"
import styles from "./index.module.scss"
import { Bell, Power, Search } from "lucide-react"
import { AuthService } from "@/services/authService"
import { useAtom, useAtomValue } from "jotai"
import {
  dragActiveAtom,
  modalContentAtom,
  notificationAlertAtom,
  notificationAtom,
  userAtom,
} from "@/store"
import Link from "next/link"
import ProfileImage from "../ProfileImage"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { PageLink } from "@/constants/PageLink"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { timeAgo } from "@/helpers/timeAgo"
import NotificationModal from "../-Modal/NotificationModal"
import { UserService } from "@/services/userService"
import { IconLogo } from "@/assets/svg/IconLogo"

export default function Navbar() {
  const user = useAtomValue(userAtom)
  const [dragActive] = useAtom(dragActiveAtom)
  const [notification, setNotification] = useAtom(notificationAtom)
  const [notificationAlert, setNotificationAlert] = useAtom(
    notificationAlertAtom,
  )
  const [, setModalContent] = useAtom(modalContentAtom)

  const profileButtonRef = useRef<HTMLDivElement>(null)
  const dropdownMenuRef = useRef<HTMLUListElement>(null)
  const notificationsDropdownMenuRef = useRef<HTMLDivElement>(null)
  const [dropdownActive, setDropdownActive] = useState(false)
  const [notificationsDropdownActive, setNotificationsDropdownActive] =
    useState(false)
  const [isMounted, setIsMounted] = useState(false)
  useOnClickOutside(dropdownMenuRef, () => setDropdownActive(false))
  useOnClickOutside(notificationsDropdownMenuRef, () =>
    setNotificationsDropdownActive(false),
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  async function logout() {
    AuthService.logout()
  }

  useEffect(() => {
    UserService.getUserNotifications().then((response) =>
      setNotification(response),
    )
  }, [notificationsDropdownActive])

  return (
    <nav className={clsx(styles.container, dragActive && styles.dragActive)}>
      <Link href={PageLink.dashboard} className={styles.logo}>
        <IconLogo />
      </Link>

      <div className={styles.topControls}>
        <Input
          className={styles.searchbar}
          prefix={<Search className={styles.searchLogo} />}
          placeholder="Search"
        />

        <div className={styles.notificationsWrapper}>
          <div
            onClick={() => {
              setNotificationsDropdownActive(true)
              setNotificationAlert(false)
            }}
            className={clsx(
              styles.notifications,
              notificationAlert && styles.notificationsAlert,
            )}
          >
            <Bell />
            {notification && notification?.count > 0 && (
              <div
                className={clsx(
                  styles.notificationsCount,
                  notificationAlert && styles.countAlert,
                )}
              >
                {notification?.count}
              </div>
            )}
          </div>
          <div
            ref={notificationsDropdownMenuRef}
            className={clsx(
              styles.notificationsDropdown,
              notificationsDropdownActive && styles.active,
            )}
          >
            {isMounted &&
              notification?.notifications.map((notification) => {
                return (
                  <div
                    key={notification.id}
                    className={clsx(
                      styles.notificationWrapper,
                      !notification.read && styles.unread,
                    )}
                    onClick={() => {
                      setNotificationsDropdownActive(false)
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

                      UserService.markNotificationAsRead(notification.id)
                    }}
                  >
                    <div className={styles.senderInformation}>
                      <ProfileImage
                        url={notification?.senderProfileImage}
                        size={48}
                      />
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
            <ProfileImage
              className={styles.profileImage}
              url={user?.profileImage}
              size={48}
            />
          </div>

          <ul
            ref={dropdownMenuRef}
            className={clsx(
              styles.dropdownMenu,
              !dropdownActive && styles.hideDropdownMenu,
            )}
          >
            <li className={styles.menuItem}>
              <Link className={styles.user} href={PageLink.userProfile}>
                {<ProfileImage url={user?.profileImage} size={48} />}
                {isMounted && (
                  <div className={styles.userInformation}>
                    {user?.name} {user?.surname}
                    <div>{user?.email}</div>
                  </div>
                )}
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
