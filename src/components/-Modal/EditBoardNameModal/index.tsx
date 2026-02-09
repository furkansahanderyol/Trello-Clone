import Input from "@/components/Input"
import styles from "./index.module.scss"
import { FormEvent, useState } from "react"
import Button from "@/components/Button"
import { toast } from "react-toastify"
import { useAtom } from "jotai"
import { modalContentAtom } from "@/store"

export default function EditBoardNameModal() {
  const [, setModalContent] = useAtom(modalContentAtom)
  const [boardName, setBoardName] = useState("")

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (boardName === "") {
      toast.error("Board name cannot be empty.")
      return
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className={styles.container}>
      <Input
        className={styles.input}
        label="Enter your new board name."
        onChange={(e) => setBoardName(e)}
      />

      <div className={styles.buttons}>
        <Button
          onClick={() => setModalContent(undefined)}
          type="button"
          text="Cancel"
        />
        <Button type="submit" text="Apply" />
      </div>
    </form>
  )
}
