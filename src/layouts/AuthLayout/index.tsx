import styles from './index.module.scss';

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({children}: Props) {
  return <main className={styles.container}>{children}</main>;
}
