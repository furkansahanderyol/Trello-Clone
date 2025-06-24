import styles from "./index.module.scss"
import Input from "@/components/Input"
import Button from "@/components/Button"
import { FormEvent, useState } from "react"
import ColorPicker from "@/components/ColorPicker"
import { WorkspaceService } from "@/services/workspaceService"

const colors = [
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#0ea5e9",
]
const gradientColors = [
  "linear-gradient(to right, #3b82f6, #9333ea)",
  "linear-gradient(to right, #ef4444, #f97316)",
  "linear-gradient(to right, #10b981, #22d3ee)",
  "linear-gradient(to right, #facc15, #f59e0b)",
  "linear-gradient(to right, #6366f1, #0ea5e9)",
  "linear-gradient(to right, #ec4899, #f43f5e)",
]

export default function CreateNewWorkspaceModal() {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [workspaceName, setWorkspaceName] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

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
        colors={colors}
        gradientColors={gradientColors}
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
