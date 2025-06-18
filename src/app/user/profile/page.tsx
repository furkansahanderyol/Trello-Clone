"use client"

import DashboardLayout from "@/layouts/DashboardLayout"

import styles from "./page.module.scss"
import Section from "@/components/Card"
import ProfileImage from "@/components/ProfileImage"
import { userAtom } from "@/store"
import { useAtomValue } from "jotai"

export default function UserProfile() {
  const user = useAtomValue(userAtom)

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Profile</h1>
          <h2 className={styles.subTitle}>Manage your personal information.</h2>
        </div>

        <div className={styles.sections}>
          <Section title={"Profile"}>
            <ProfileImage
              isUploadAllowed
              className={styles.profileImage}
              url={user?.profileImage}
            />
          </Section>
        </div>
      </div>
    </DashboardLayout>
  )
}
