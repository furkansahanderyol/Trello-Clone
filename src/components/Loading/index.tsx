import styles from "./index.module.scss"

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading} />
      <div className={styles.text}>
        Please wait while we are connecting to the server.
      </div>
    </div>
  )
}
