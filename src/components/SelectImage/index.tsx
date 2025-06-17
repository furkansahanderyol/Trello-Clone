"use client"

import { Camera } from "lucide-react"
import styles from "./index.module.scss"
import { useAtom } from "jotai"
import { modalContentAtom } from "@/store"
import UploadImageModal from "../UploadImageModal"

export default function SelectImage() {
  const [, setModalContent] = useAtom(modalContentAtom)

  function handleTest() {
    setModalContent({
      title: "Select Photo",
      content: <UploadImageModal />,
    })
  }

  return (
    <div onClick={handleTest} className={styles.container}>
      <Camera className={styles.camera} />
    </div>
  )
}
