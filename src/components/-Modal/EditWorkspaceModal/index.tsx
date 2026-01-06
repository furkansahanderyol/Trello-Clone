import Input from "@/components/Input"
import styles from "./index.module.scss"
import { useAtom } from "jotai"
import {
  allWorkspacesAtom,
  modalContentAtom,
  selectedWorkspaceAtom,
} from "@/store"
import Button from "@/components/Button"
import { FormEvent, useState } from "react"
import { WorkspaceService } from "@/services/workspaceService"

export default function EditWorkspaceModal() {
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom)
  const [, setWorkspaces] = useAtom(allWorkspacesAtom)
  const [input, setInput] = useState(selectedWorkspace?.name)
  const [, setModalContent] = useAtom(modalContentAtom)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!input || input === "" || !selectedWorkspace?.id) return

    WorkspaceService.editWorkspace(selectedWorkspace?.id as string, input)

    setWorkspaces((prev) => {
      return prev.map((workspace) => {
        if (workspace.workspace.id !== selectedWorkspace.id) return workspace

        return {
          ...workspace,
          workspace: {
            ...workspace.workspace,
            name: input,
          },
        }
      })
    })

    setModalContent(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <Input
        className={styles.input}
        label={"Change workspace name"}
        defaultValue={selectedWorkspace?.name}
        onChange={(e) => setInput(e)}
      />
      <div className={styles.buttons}>
        <Button type="button" text="Cancel" />
        <Button
          type="submit"
          text="Apply"
          disabled={input === selectedWorkspace?.name}
        />
      </div>
    </form>
  )
}
