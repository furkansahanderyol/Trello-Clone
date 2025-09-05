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

export default function AddWorkspaceMemberModal() {
  const params = useParams()
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

  const searchInputValue = useDebounce(searchInput, 200)

  useEffect(() => {
    if (searchInput === "") return

    UserService.searchUser(searchInputValue).then((response) => {
      setSearchUsers(response)
    })
  }, [searchInput])

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
        ""
      ).then((response) => {
        console.log("response", response)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.searchSide}>
        <Input
          type="text"
          onChange={(e) => setSearchInput(e)}
          placeholder="Type email or name"
          className={styles.searchInput}
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
            searchedUsers && styles.dropdownActive
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
            <Button type="button" text="Cancel" />
            <Button type="submit" text="Share" />
          </div>
        </div>
      )}
    </form>
  )
}
