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
import ColorPicker from "@/components/ColorPicker"
import { Colors, GradientColors } from "@/constants/CardColors"

export default function EditWorkspaceModal() {
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom)
  const [, setWorkspaces] = useAtom(allWorkspacesAtom)
  const [input, setInput] = useState(selectedWorkspace?.name)
  const [, setModalContent] = useAtom(modalContentAtom)
  const [selectedColor, setSelectedColor] = useState(selectedWorkspace?.color)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (
      !input ||
      input === "" ||
      !selectedWorkspace?.id ||
      selectedWorkspace.color === selectedColor ||
      !selectedColor
    )
      return

    WorkspaceService.editWorkspace(
      selectedWorkspace?.id as string,
      input,
      selectedColor
    )

    setWorkspaces((prev) => {
      return prev.map((workspace) => {
        if (workspace.workspace.id !== selectedWorkspace.id) return workspace

        return {
          ...workspace,
          workspace: {
            ...workspace.workspace,
            name: input,
            color: selectedColor,
          },
        }
      })
    })

    setModalContent(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          className={styles.input}
          label={"Change workspace name"}
          defaultValue={selectedWorkspace?.name}
          onChange={(e) => setInput(e)}
        />
      </div>
      <div className={styles.colorPicker}>
        <ColorPicker
          selectedColor={selectedColor || Colors[0]}
          colors={Colors}
          gradientColors={GradientColors}
          onSelect={(color) => setSelectedColor(color)}
        />
      </div>
      <div className={styles.buttons}>
        <Button type="button" text="Cancel" />
        <Button
          type="submit"
          text="Apply"
          disabled={
            input === selectedWorkspace?.name &&
            selectedWorkspace?.color === selectedColor
          }
        />
      </div>
    </form>
  )
}
