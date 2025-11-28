import { useAtom } from "jotai"
import styles from "./index.module.scss"
import { workspaceMembersAtom } from "@/store"
import ProfileImage from "../ProfileImage"
import { useRef, useState } from "react"
import { WorkspaceMember } from "@/store/types"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"

export default function WorkspaceHeader() {
  const memberRef = useRef<HTMLDivElement | null>(null)
  const [workspaceMembers] = useAtom(workspaceMembersAtom)
  const [selectedUser, setSelectedUser] = useState<WorkspaceMember | null>(null)

  useOnClickOutside(memberRef, () => setSelectedUser(null))

  return (
    <div ref={memberRef} className={styles.container}>
      <div className={styles.leftSide}>Header Left</div>
      <div className={styles.rightSide}>
        <div className={styles.workspaceMembers}>
          {workspaceMembers?.map((member, index) => {
            if (index >= 6) return

            return (
              <div
                onClick={() => setSelectedUser(member)}
                key={index}
                className={styles.imageWrapper}
              >
                <ProfileImage
                  url={member.profileImage}
                  className={styles.profileImage}
                />
              </div>
            )
          })}
        </div>
        {selectedUser && (
          <div className={styles.memberDetails}>
            <div className={styles.upperSide}>
              <ProfileImage url={selectedUser?.profileImage} />
              <div className={styles.userDetails}>
                <div
                  className={styles.name}
                >{`${selectedUser?.name} ${selectedUser?.surname}`}</div>
                <div className={styles.email}>{selectedUser?.email}</div>
              </div>
            </div>
            <div
              className={styles.remove}
            >{`Remove ${selectedUser?.name} from workspace.`}</div>
          </div>
        )}
      </div>
    </div>
  )
}
