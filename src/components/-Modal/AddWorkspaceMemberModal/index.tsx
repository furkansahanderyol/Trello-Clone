import Input from "@/components/Input"
import styles from "./index.module.scss"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { UserService } from "@/services/userService"
import ProfileImage from "@/components/ProfileImage"
import clsx from "clsx"
import { X } from "lucide-react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import Textarea from "@/components/Textarea"
import Button from "@/components/Button"
import { WorkspaceService } from "@/services/workspaceService"
import { useParams } from "next/navigation"
import { useAtom } from "jotai"
import {
  modalContentAtom,
  selectedWorkspaceAtom,
  socketAtom,
  userAtom,
} from "@/store"

export default function AddWorkspaceMemberModal() {
  const params = useParams()
  const [user] = useAtom(userAtom)
  const [workspace] = useAtom(selectedWorkspaceAtom)
  const [socket] = useAtom(socketAtom)
  const [, setModalContent] = useAtom(modalContentAtom)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [searchedUsers, setSearchUsers] = useState<
    | {
        name: string
        surname: string
        email: string
        profileImage: string
        isVerified: boolean
      }[]
    | undefined
  >(undefined)
  const [selectedUsers, setSelectedUsers] = useState<
    | {
        name: string
        surname: string
        email: string
        profileImage: string
        isVerified: boolean
      }[]
    | undefined
  >(undefined)
  const [dropdownActive, setDropdownActive] = useState(false)

  const searchInputValue = useDebounce(searchInput, 200)

  useEffect(() => {
    if (searchInput === "") {
      setDropdownActive(false)
      return
    }

    setDropdownActive(true)
    UserService.searchUser(searchInputValue).then((response) => {
      setSearchUsers(response)
    })
  }, [searchInput, dropdownActive])

  useOnClickOutside(dropdownRef, () => {
    setSearchInput("")
    setSearchUsers(undefined)
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (selectedUsers) {
      WorkspaceService.inviteUsers(
        params.id as string,
        selectedUsers.map((u) => u.email),
        `${user?.name} send you a invite for ${workspace?.name}.`
      ).then(() => {
        socket?.emit("invite_users", JSON.stringify(selectedUsers))
      })
    }
  }

  function handleCloseModal() {
    setModalContent(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.searchSide}>
        <Input
          type="text"
          onChange={(e) => setSearchInput(e)}
          placeholder="Type email or name"
          className={styles.searchInput}
          value={searchInput}
        />
        <div className={styles.selectedUsers}>
          {selectedUsers?.map((user, index) => {
            return (
              <div key={index} className={styles.selectedUser}>
                <div className={styles.userEmail}>{user.email}</div>
                <div
                  onClick={() =>
                    setSelectedUsers((prev) => {
                      if (!prev) return undefined

                      const updatedUsers = prev.filter(
                        (prevUser) => prevUser.email !== user.email
                      )

                      return updatedUsers
                    })
                  }
                  className={styles.closeButton}
                >
                  <X size={16} />
                </div>
              </div>
            )
          })}
        </div>

        <div
          ref={dropdownRef}
          className={clsx(
            styles.dropdown,
            dropdownActive && searchedUsers && styles.dropdownActive
          )}
        >
          {searchedUsers?.map((user, index) => {
            const userNameFirstLetters = `${user.name[0] + user.surname[0]}`

            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedUsers((prev) => {
                    if (!prev) return [user]
                    if (
                      prev?.some(
                        (selectedUser) => selectedUser.email === user.email
                      )
                    ) {
                      const updatedUsers = prev.filter(
                        (prevUser) => prevUser.email !== user.email
                      )

                      return updatedUsers
                    }

                    return [...prev, user]
                  })

                  setSearchInput("")
                  setDropdownActive(false)
                }}
                className={clsx(
                  styles.searchedUser,
                  selectedUsers?.some(
                    (selectedUser) => selectedUser.email === user.email
                  ) && styles.selected
                )}
              >
                <div className={styles.profileImage}>
                  {user.profileImage ? (
                    <ProfileImage url={user.profileImage} />
                  ) : (
                    <div className={styles.placeholderImage}>
                      {userNameFirstLetters}
                    </div>
                  )}
                </div>
                <div className={styles.userNameWrapper}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userIsVerified}>
                    {user.isVerified && "Verified account"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {selectedUsers && (
        <div className={styles.inputSide}>
          <Textarea className={styles.textarea} />

          <div className={styles.buttonsContainer}>
            <Button type="button" text="Cancel" onClick={handleCloseModal} />
            <Button type="submit" text="Share" />
          </div>
        </div>
      )}
    </form>
  )
}
