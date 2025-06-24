import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"
import { useAtomValue } from "jotai"
import { pageLoadingAtom } from "@/store"

interface IProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: IProps) {
  const pageLoading = useAtomValue(pageLoadingAtom)

  return (
    <div>
      <Navbar />
      <main className={styles.container}>
        {pageLoading ? (
          <div className={styles.loading} />
        ) : (
          <div>{children}</div>
        )}
      </main>
    </div>
  )
}
