import { Editor, generateHTML } from "@tiptap/react"
import styles from "./styles.module.scss"
import { AuthorType, TaskType } from "@/store/types"
import Image from "next/image"
import Button from "@/components/Button"
import { TaskService } from "@/services/taskService"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import TiptapImage from "@tiptap/extension-image"
import StarterKit from "@tiptap/starter-kit"
import { useAtom } from "jotai"
import { editTaskAtom, taskAtom } from "@/store"

interface IProps {
  editor: Editor | null
  comment: string
  author: AuthorType
  boardId: string
  taskId: string
  commentId: string
  markdownTextarea: React.ReactNode
}

export default function ReadOnlyComment({
  editor,
  comment,
  author,
  boardId,
  taskId,
  commentId,
  markdownTextarea,
}: IProps) {
  const [task, setTask] = useAtom(taskAtom)
  if (!comment) return null
  const params = useParams()
  const commentRef = useRef(null)
  const [edit, setEdit] = useAtom(editTaskAtom)

  let tiptapJSON
  try {
    const parsed = JSON.parse(comment)
    tiptapJSON = { type: "doc", content: parsed }
  } catch {
    return null
  }

  const html = generateHTML(tiptapJSON, [StarterKit, TiptapImage])

  useOnClickOutside(commentRef, () => {
    setEdit(false)
  })

  const userNameFirstLetters = `${author.name[0] + author.surname[0]}`

  return (
    <div ref={commentRef}>
      {edit && editor ? (
        markdownTextarea
      ) : (
        <div className={styles.container}>
          <div className={styles.authorInfo}>
            <div className={styles.authorImage}>
              {!author.profileImage || author.profileImage === "" ? (
                <div className={styles.placeholderProfileImage}>
                  {userNameFirstLetters}
                </div>
              ) : (
                <Image
                  fill
                  src={`http://localhost:8000/${author.profileImage}`}
                  alt="Profile image"
                />
              )}
            </div>
            <div className={styles.name}>{author.name}</div>
          </div>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className={styles.commentButtons}>
            <Button
              className={styles.button}
              text="Edit"
              type="button"
              onClick={() => {
                setEdit(true)
                editor?.commands.setContent(JSON.parse(comment))
              }}
            />
            <Button
              onClick={() =>
                TaskService.deleteTaskComment(
                  params.id as string,
                  boardId,
                  taskId,
                  commentId
                ).then((response) => {
                  if (response.success) {
                    const updatedComments = task?.comments.filter((comment) => {
                      return comment.id !== commentId
                    })

                    setTask((prev) => {
                      if (!prev) return prev

                      if (updatedComments) {
                        const updatedTask: TaskType = {
                          ...prev,
                          comments: updatedComments,
                        }

                        return updatedTask
                      }
                    })
                  }
                })
              }
              className={styles.button}
              text="Delete"
              type="button"
            />
          </div>
        </div>
      )}
    </div>
  )
}
