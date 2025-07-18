import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"
import { getDefaultStore, useAtomValue } from "jotai"
import { boardsAtom, pageLoadingAtom, trackBoardsChangeAtom } from "@/store"
import Sidebar from "@/components/Sidebar"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useParams } from "next/navigation"
import { BoardService } from "@/services/boardService"

interface IProps {
  children: React.ReactNode
}

export default function WorkspaceLayout({ children }: IProps) {
  const socketRef = useRef<Socket | null>(null)
  const pageLoading = useAtomValue(pageLoadingAtom)
  const params = useParams()
  const trackBoardsChange = useAtomValue(trackBoardsChangeAtom)
  const boards = useAtomValue(boardsAtom)

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

  return (
    <div>
      <Navbar />
      <main className={styles.container}>
        <Sidebar>
          <div>Sidebar</div>
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
