"use client"

import Image from "next/image"
import styles from "./index.module.scss"
import { User } from "lucide-react"
import clsx from "clsx"
import SelectImage from "../SelectImage"
import { useEffect, useState } from "react"

interface IProps {
  url: string | undefined
  className?: string
  isUploadAllowed?: boolean
  size?: number
}

export default function ProfileImage({
  url,
  className,
  isUploadAllowed,
  size,
}: IProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={clsx(styles.profileImage, className)}>
        <User className={styles.image} />
      </div>
    )
  }

  return (
    <div
      className={clsx(styles.profileImage, className)}
      suppressHydrationWarning
    >
      {isUploadAllowed && <SelectImage />}
      {url && (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
          className={styles.imageWrapper}
        >
          <Image
            src={`http://localhost:8000/${url}`}
            alt="Profile image of user."
            fill
          />
        </div>
      )}
    </div>
  )
}
