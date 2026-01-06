"use client"

import styles from "./page.module.scss"
import Section from "@/components/Card"
import ProfileImage from "@/components/ProfileImage"
import { userAtom } from "@/store"
import { useAtomValue } from "jotai"
import Setting from "@/components/Setting"
import { CircleUser, Mail, TreeDeciduous } from "lucide-react"
import CustomLink from "@/components/CustomLink"
import { PageLink } from "@/constants/PageLink"
import SettingsLayout from "@/layouts/SettingsLayout"

export default function UserProfile() {
  const user = useAtomValue(userAtom)

  return (
    <SettingsLayout>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Profile</h1>
          <h2 className={styles.subTitle}>Manage your personal information.</h2>
        </div>

        <div className={styles.sections}>
          <Section title="">
            <div className={styles.settings}>
              <Setting
                label="Profile Image"
                value={
                  <ProfileImage
                    isUploadAllowed
                    url={user?.profileImage}
                    className={styles.profileImage}
                  />
                }
              />
              <Setting
                label="Name"
                value={user?.name!}
                suffix={<CircleUser />}
              />
              <Setting
                label="Surname"
                value={user?.surname!}
                suffix={<TreeDeciduous />}
              />
              <Setting label="Email" value={user?.email!} suffix={<Mail />} />
            </div>
            <CustomLink
              className={styles.changePassword}
              link={PageLink.changePassword}
              label="Change Password"
            />
          </Section>
        </div>
      </div>
    </SettingsLayout>
  )
}
