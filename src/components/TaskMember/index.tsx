import { X } from "lucide-react"
import ProfileImage from "../ProfileImage"
import styles from "./index.module.scss"

interface IProps {
  name: string
  surname: string
  profileImage: string | undefined
  email: string
  onClick: () => void
}

export default function TaskMember({
  name,
  surname,
  profileImage,
  email,
  onClick,
}: IProps) {
  return (
    <div className={styles.container}>
      <ProfileImage className={styles.userProfileImage} url={profileImage} />
      <div className={styles.userInfo}>{`${name} ${surname}`}</div>

      <div onClick={onClick} className={styles.deleteButton}>
        <X />
      </div>
    </div>
  )
}
