"use client"

import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import { selectedWorkspaceAtom } from "@/store"
import { useAtom } from "jotai"

export default function Workspace() {
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom)

  console.log("selectedWorksapce", selectedWorkspace)

  return (
    <WorkspaceLayout>
      <div>Hi</div>
    </WorkspaceLayout>
  )
}
