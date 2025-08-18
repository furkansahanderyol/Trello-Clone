import StarterKit from "@tiptap/starter-kit"
import { generateHTML } from "@tiptap/react"
import styles from "./styles.module.scss"
import { AuthorType } from "@/store/types"
import Image from "next/image"

interface IProps {
  comment: string
  author: AuthorType
}

export default function ReadOnlyComment({ comment, author }: IProps) {
  if (!comment) return null

  let tiptapJSON
  try {
    const parsed = JSON.parse(comment)
    tiptapJSON = { type: "doc", content: parsed }
  } catch {
    return null
  }

  const html = generateHTML(tiptapJSON, [StarterKit])

  return (
    <div className={styles.container}>
      <div className={styles.authorInfo}>
        <div className={styles.authorImage}>
          <Image fill src={author.profileImage} alt="Profile image" />
        </div>
        <div className={styles.name}>{author.name}</div>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
