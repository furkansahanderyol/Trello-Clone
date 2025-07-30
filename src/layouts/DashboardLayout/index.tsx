import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"
import { useAtom, useAtomValue } from "jotai"
import { modalContentAtom, pageLoadingAtom } from "@/store"
import Sidebar from "@/components/Sidebar"
import Button from "@/components/Button"
import CreateNewWorkspaceModal from "@/components/-Modal/CreateNewWorkspaceModal"

interface IProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: IProps) {
  const pageLoading = useAtomValue(pageLoadingAtom)
  const [, setModalContent] = useAtom(modalContentAtom)

  return (
    <div>
      <Navbar />
      <main className={styles.container}>
        <Sidebar>
          <Button
            text="Create"
            type="button"
            onClick={() =>
              setModalContent({
                title: "Create your new workspace",
                content: <CreateNewWorkspaceModal />,
                size: "m",
              })
            }
          />
        </Sidebar>

        <div className={styles.content}>
          {pageLoading ? (
            <div className={styles.loading} />
          ) : (
            <div>{children}</div>
          )}
        </div>
      </main>
    </div>
  )
}
