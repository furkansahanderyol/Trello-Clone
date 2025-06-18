"use client"

import { useAtom } from "jotai"
import styles from "./index.module.scss"
import { modalContentAtom } from "@/store"
import clsx from "clsx"
import { X } from "lucide-react"

export default function ModalContainer() {
  const [modalContent, setModalContent] = useAtom(modalContentAtom)

  return (
    <div
      className={clsx(styles.container, modalContent && styles.modalVisible)}
    >
      <div
        onClick={() => setModalContent(undefined)}
        className={styles.overlay}
      />
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.title}>{modalContent?.title}</div>
          <div
            onClick={() => setModalContent(undefined)}
            className={styles.closeButton}
          >
            <X />
          </div>
        </div>

        {modalContent?.content}
      </div>
    </div>
  )
}
