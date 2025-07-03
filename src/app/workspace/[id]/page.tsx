"use client"

import styles from "./page.module.scss"
import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import { selectedWorkspaceAtom } from "@/store"
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { useAtom } from "jotai"
import { useState } from "react"

export default function Workspace() {
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom)

  return (
    <WorkspaceLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>Header</div>
          <div>Header Left</div>
        </div>
        <div className={styles.body}>
          <div className={styles.lists}>
            <DndContext></DndContext>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
