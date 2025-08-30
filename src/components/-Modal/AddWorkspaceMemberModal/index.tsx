import Input from "@/components/Input"
import styles from "./index.module.scss"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { UserService } from "@/services/userService"
import ProfileImage from "@/components/ProfileImage"

export default function AddWorkspaceMemberModal() {
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

  const searchInputValue = useDebounce(searchInput, 200)

  useEffect(() => {
    UserService.searchUser(searchInputValue).then((response) => {
      setSearchUsers(response)
    })
  }, [searchInput])

  return (
    <form className={styles.container}>
      <div className={styles.searchSide}>
        <Input
          type="text"
          onChange={(e) => setSearchInput(e)}
          placeholder="Type email or name"
          className={styles.searchInput}
        />
        <div className={styles.dropdown}>
          {searchedUsers?.map((user, index) => {
            const userNameFirstLetters = `${user.name[0] + user.surname[0]}`

            return (
              <div key={index} className={styles.searchedUser}>
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
    </form>
  )
}
