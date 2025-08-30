import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"
import { getDefaultStore, useAtom, useAtomValue } from "jotai"
import {
  allWorkspacesAtom,
  boardsAtom,
  modalContentAtom,
  pageLoadingAtom,
  trackBoardsChangeAtom,
  userAtom,
} from "@/store"
import Sidebar from "@/components/Sidebar"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useParams } from "next/navigation"
import { BoardService } from "@/services/boardService"
import Button from "@/components/Button"
import AddWorkspaceMemberModal from "@/components/-Modal/AddWorkspaceMemberModal"

interface IProps {
  children: React.ReactNode
}

export default function WorkspaceLayout({ children }: IProps) {
  const socketRef = useRef<Socket | null>(null)
  const pageLoading = useAtomValue(pageLoadingAtom)
  const params = useParams()
  const trackBoardsChange = useAtomValue(trackBoardsChangeAtom)
  const boards = useAtomValue(boardsAtom)
  const [modalContent, setModalContent] = useAtom(modalContentAtom)
  const [allWorkspaces] = useAtom(allWorkspacesAtom)
  const defaultStore = getDefaultStore()

  useEffect(() => {
    BoardService.getAllBoards(params.id as string)
  }, [])

  useEffect(() => {
    const socket = io("http://localhost:8000")
    socketRef.current = socket

    if (socket.connected) {
      console.log("Already connected.")
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit(
        "update_board",
        JSON.stringify({ workspaceId: params.id, boards: boards })
      )

      socketRef.current.on("board_updated", (updatedBoards) => {
        defaultStore.set(boardsAtom, [...updatedBoards])
      })
    }
  }, [trackBoardsChange])

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
