import styles from "./index.module.scss"
import Input from "@/components/Input"
import Button from "@/components/Button"
import { FormEvent, useState } from "react"
import ColorPicker from "@/components/ColorPicker"
import { WorkspaceService } from "@/services/workspaceService"
import { useAtom } from "jotai"
import { modalContentAtom } from "@/store"
import { Colors, GradientColors } from "@/constants/CardColors"

export default function CreateNewWorkspaceModal() {
  const [, setModalContent] = useAtom(modalContentAtom)
  const [selectedColor, setSelectedColor] = useState(Colors[0])
  const [workspaceName, setWorkspaceName] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setModalContent(undefined)
    WorkspaceService.createWorkspace(workspaceName, selectedColor)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        className={styles.input}
        label="Workspace name*"
        onChange={(e) => setWorkspaceName(e)}
      />
      <ColorPicker
        selectedColor={selectedColor}
        colors={Colors}
        gradientColors={GradientColors}
        onSelect={(color) => setSelectedColor(color)}
      />

      <Button
        className={styles.button}
        type="submit"
        text="Create new workspace"
      />
    </form>
  )
}
