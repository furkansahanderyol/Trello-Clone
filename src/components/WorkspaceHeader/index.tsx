import { useAtom } from "jotai"
import styles from "./index.module.scss"
import { selectedWorkspaceAtom, userAtom, workspaceMembersAtom } from "@/store"
import ProfileImage from "../ProfileImage"
import { useRef, useState } from "react"
import { WorkspaceMember } from "@/store/types"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { WorkspaceService } from "@/services/workspaceService"
import { useParams } from "next/navigation"

export default function WorkspaceHeader() {
  const memberRef = useRef<HTMLDivElement | null>(null)
  const [user] = useAtom(userAtom)
  const [workspace] = useAtom(selectedWorkspaceAtom)
  const [selectedUser, setSelectedUser] = useState<WorkspaceMember | null>(null)

  const [workspaceMembers, setWorkspaceMembers] = useState(workspace?.members)

  const params = useParams()

  console.log("workspace", workspace)

  useOnClickOutside(memberRef, () => setSelectedUser(null))

  function removeWorkspaceMember(id: string, email: string) {
    WorkspaceService.removeWorkspaceMember(id, email).then((response) => {
      if (!response) return

      setWorkspaceMembers(() => {
        const updatedMembers = workspaceMembers?.filter(
          (member) => member.email !== email
        )

        return updatedMembers
      })
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>Header Left</div>
      <div ref={memberRef}>
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
                    size={16}
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
              {selectedUser.email !== user?.email && (
                <div
                  onClick={() =>
                    removeWorkspaceMember(
                      params.id as string,
                      selectedUser.email
                    )
                  }
                  className={styles.remove}
                >{`Remove ${selectedUser?.name} from workspace.`}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
