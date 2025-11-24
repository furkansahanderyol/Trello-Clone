import { WorkspaceMember as Member } from "@/store/types"
import styles from "./index.module.scss"
import ProfileImage from "../ProfileImage"

interface IProps {
  member: Member
  onClick: () => void
}

export default function WorkspaceMember({ member, onClick }: IProps) {
  return (
    <div onClick={onClick} className={styles.container}>
      <ProfileImage url={member.profileImage} />

      <div className={styles.memberName}>
        {`${member.name} ${member.surname}`}
      </div>
    </div>
  )
}
