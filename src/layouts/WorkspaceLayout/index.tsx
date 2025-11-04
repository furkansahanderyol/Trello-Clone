import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"
import { getDefaultStore, useAtom, useAtomValue } from "jotai"
import {
  boardsAtom,
  modalContentAtom,
  pageLoadingAtom,
  socketAtom,
  trackBoardsChangeAtom,
} from "@/store"
import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BoardService } from "@/services/boardService"
import Button from "@/components/Button"
import AddWorkspaceMemberModal from "@/components/-Modal/AddWorkspaceMemberModal"

interface IProps {
  children: React.ReactNode
}

export default function WorkspaceLayout({ children }: IProps) {
  const pageLoading = useAtomValue(pageLoadingAtom)
  const params = useParams()
  const trackBoardsChange = useAtomValue(trackBoardsChangeAtom)
  const boards = useAtomValue(boardsAtom)
  const [, setModalContent] = useAtom(modalContentAtom)
  const defaultStore = getDefaultStore()

  const [socket] = useAtom(socketAtom)

  useEffect(() => {
    BoardService.getAllBoards(params.id as string)
  }, [])

  useEffect(() => {
    if (socket && params.id) {
      socket.emit("join_room", params.id)

      socket.emit(
        "update_board",
        JSON.stringify({ workspaceId: params.id, boards: boards })
      )

      socket.on("board_updated", (updatedBoards) => {
        defaultStore.set(boardsAtom, [...updatedBoards])
      })
    }
  }, [trackBoardsChange, socket, params.id])

  function handleMemberAdd() {
    setModalContent({
      title: "Add new member",
      content: <AddWorkspaceMemberModal />,
      size: "s",
    })
  }

  return (
    <div>
      <Navbar />
      <main className={styles.container}>
        <Sidebar>
          <Button
            type="button"
            text="Add new member"
            onClick={handleMemberAdd}
          />
        </Sidebar>

        {pageLoading ? (
          <div className={styles.loading} />
        ) : (
          <div className={styles.content}>{children}</div>
        )}
      </main>
    </div>
  )
}
