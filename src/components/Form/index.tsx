import clsx from "clsx"
import styles from "./index.module.scss"

interface Props {
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  formHeader?: string
  className?: string
}

export default function Form({
  children,
  onSubmit,
  formHeader,
  className,
}: Props) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.formHeader}>{formHeader}</div>
      <form onSubmit={onSubmit} noValidate>
        <div>{children}</div>
      </form>
    </div>
  )
}
