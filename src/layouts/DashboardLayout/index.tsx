import Navbar from "@/components/Navbar"
import styles from "./index.module.scss"

interface IProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: IProps) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
