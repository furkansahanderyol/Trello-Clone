"use client"

import DashboardLayout from "@/layouts/DashboardLayout"
import styles from "./page.module.scss"
import { WorkspaceService } from "@/services/workspaceService"
import { useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import {
  allWorkspacesAtom,
  modalContentAtom,
  selectedWorkspaceAtom,
} from "@/store"
import EmptyLayout from "@/layouts/EmptyLayout"
import { Presentation } from "lucide-react"
import CreateNewWorkspaceModal from "@/components/-Modal/CreateNewWorkspaceModal"
import WorkspaceCard from "@/components/-Card/WorkspaceCard"

export default function Dashboard() {
  const [workspaces] = useAtom(allWorkspacesAtom)
  const [, setModalContent] = useAtom(modalContentAtom)
  const [, setSelectedWorkspace] = useAtom(selectedWorkspaceAtom)

  useEffect(() => {
    WorkspaceService.getAllWorkspaces()
  }, [])

  function handleCreateNewWorkspace() {
    setModalContent({
      title: "Create your new workspace",
      content: <CreateNewWorkspaceModal />,
      size: "m",
    })
  }

  return (
    <DashboardLayout>
      {workspaces.length === 0 ? (
        <EmptyLayout
          title="No workspace yet"
          description="You don't have any workspace created. Start by creating your first workspace!"
          icon={<Presentation className={styles.emptyIcon} size={32} />}
          buttonText="Create new workspace"
          onClick={handleCreateNewWorkspace}
        />
      ) : (
        <div className={styles.container}>
          <div className={styles.workspaces}>
            {workspaces.map((workspace, index) => {
              return (
                <WorkspaceCard
                  key={index}
                  onClick={() => setSelectedWorkspace(workspace.workspace)}
                  {...workspace.workspace}
                />
              )
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
