import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"
import { useAtomValue } from "jotai"
import { pageLoadingAtom } from "@/store"
import Sidebar from "@/components/Sidebar"
import Button from "@/components/Button"

interface IProps {
  children: React.ReactNode
}

export default function WorkspaceLayout({ children }: IProps) {
  const pageLoading = useAtomValue(pageLoadingAtom)

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
