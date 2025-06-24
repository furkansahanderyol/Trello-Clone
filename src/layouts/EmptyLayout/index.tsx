import Button from "@/components/Button"
import styles from "./index.module.scss"

interface IProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
  buttonText: string
}

export default function EmptyLayout({
  title,
  description,
  icon,
  buttonText,
  onClick,
}: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.upper}>
          <div className={styles.titleWrapper}>
            {icon}
            <h1 className={styles.title}>{title}</h1>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
        <Button type="button" text={buttonText} onClick={onClick} />
      </div>
    </div>
  )
}
