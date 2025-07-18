import Image from "next/image"
import styles from "./index.module.scss"
import { User } from "lucide-react"
import clsx from "clsx"
import SelectImage from "../SelectImage"

interface IProps {
  url: string | undefined
  className?: string
  isUploadAllowed?: boolean
}

export default function ProfileImage({
  url,
  className,
  isUploadAllowed,
}: IProps) {
  return (
    <div className={styles.profileImage}>
      {isUploadAllowed && <SelectImage />}
      {url ? (
        <div className={styles.imageWrapper}>
          <Image
            src={`http://localhost:8000/${url}`}
            alt="Profile image of user."
            fill
          />
        </div>
      ) : (
        <User className={clsx(styles.image, className)} />
      )}
    </div>
  )
}
