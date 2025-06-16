import Image from "next/image"
import styles from "./index.module.scss"
import { User } from "lucide-react"

interface IProps {
  url: string | undefined
}

export default function ProfileImage({ url }: IProps) {
  return (
    <div className={styles.profileImage}>
      {url ? (
        <div>
          <Image src={url} alt="Profile image of user." />
        </div>
      ) : (
        <User className={styles.image} />
      )}
    </div>
  )
}
