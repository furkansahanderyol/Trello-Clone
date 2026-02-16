import { useAtom } from "jotai"
import styles from "./index.module.scss"
import {
  selectedWorkspaceAtom,
  socketAtom,
  userAtom,
  workspaceMembersAtom,
} from "@/store"
import ProfileImage from "../ProfileImage"
import { useEffect, useRef, useState } from "react"
import { WorkspaceMember } from "@/store/types"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { WorkspaceService } from "@/services/workspaceService"
import { useParams } from "next/navigation"
import clsx from "clsx"

export default function WorkspaceHeader() {
  const memberRef = useRef<HTMLDivElement | null>(null)
  const [user] = useAtom(userAtom)
  const [workspace] = useAtom(selectedWorkspaceAtom)
  const [selectedUser, setSelectedUser] = useState<WorkspaceMember | null>(null)
  const [joinedUser, setJoinedUser] = useState<{ email: string } | null>(null)
  const [workspaceMembers, setWorkspaceMembers] = useState(workspace?.members)

  const [socket] = useAtom(socketAtom)

  const params = useParams()

  useOnClickOutside(memberRef, () => setSelectedUser(null))

  function removeWorkspaceMember(id: string, email: string) {
    WorkspaceService.removeWorkspaceMember(id, email).then((response) => {
      if (!response) return

      setWorkspaceMembers(() => {
        const updatedMembers = workspaceMembers?.filter(
          (member) => member.email !== email,
        )

        return updatedMembers
      })
    })
  }

  useEffect(() => {
    if (!socket) return

    socket.on("user_joined", (data) => {
      setJoinedUser(data)
    })

    socket.on("user_left", (data) => {
      console.log("user-left", data)
    })
  }, [socket])

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>{workspace?.name}</div>
      <div ref={memberRef}>
        <div className={styles.rightSide}>
          <div className={styles.workspaceMembers}>
            {workspaceMembers?.map((member, index) => {
              if (index >= 6) return

              return (
                <div
                  onClick={() => setSelectedUser(member)}
                  key={index}
                  className={clsx(
                    styles.imageWrapper,
                    joinedUser?.email === member.email && styles.active,
                  )}
                >
                  <ProfileImage
                    url={member.profileImage}
                    className={clsx(
                      styles.profileImage,
                      joinedUser?.email === member.email && styles.active,
                    )}
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
                      selectedUser.email,
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
