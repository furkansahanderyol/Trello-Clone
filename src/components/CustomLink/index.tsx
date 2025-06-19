import Link from "next/link"
import styles from "./index.module.scss"
import clsx from "clsx"

interface IProps {
  link: string
  className?: string
  label: string
}

export default function CustomLink({ link, className, label }: IProps) {
  return (
    <Link className={clsx(styles.link, className)} href={link}>
      {label}
    </Link>
  )
}
