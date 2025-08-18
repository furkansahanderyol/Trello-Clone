import styles from "./index.module.scss"
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { PersonStandingIcon, Plus, Star, Text } from "lucide-react"
import TaskOption from "@/components/TaskOption"
import Button from "@/components/Button"
import { TaskService } from "@/services/taskService"
import { useParams } from "next/navigation"
import { UploadImageResponse } from "@/services/type"
import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import MenuBar from "@/components/-Tiptap/MenuBar"
import Image from "@tiptap/extension-image"
import { useAtom } from "jotai"
import { taskAtom, userAtom } from "@/store"
import ReadOnlyComment from "@/components/-Tiptap/ReadOnlyComment"

interface IProps {
  title: string
  taskId: string
  boardId: string
}

export default function TaskModal({ title, boardId, taskId }: IProps) {
  const [task, setTask] = useAtom(taskAtom)
  const [user] = useAtom(userAtom)
  const descriptionAreaRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [focus, setFocus] = useState(false)
  const [description, setDescription] = useState<JSONContent>()
  const [comment, setComment] = useState<JSONContent>()
  const caretPositionRef = useRef<HTMLTextAreaElement | null>(null)
  const params = useParams()
  const [taskImage, setTaskImage] = useState<UploadImageResponse | undefined>()
  const [uploadedImages, setUploadedImages] = useState<
    (string | null)[] | undefined
  >(undefined)

  const descriptionEditor = useEditor({
    extensions: [StarterKit, Image],
    immediatelyRender: false,
    onCreate({ editor }) {},
    onUpdate({ editor }) {
      const uploadedImages = currentImages(editor)
      setUploadedImages(uploadedImages)

      const json = editor.getJSON()

      setDescription(json)
    },
    editorProps: {
      handleDrop(view, event) {
        console.log("view", view)
        console.log("event", event)
      },
    },
  })

  const commentEditor = useEditor({
    extensions: [StarterKit, Image],
    content: description ? description : "Enter more detailed description...",
    immediatelyRender: false,
    onUpdate({ editor }) {
      const uploadedImages = currentImages(editor)
      const json = editor.getJSON()
      setUploadedImages(uploadedImages)
      setComment(json)
    },
  })

  const taskOptions = [
    {
      icon: <Plus />,
      label: "Labels",
      dropdownOptions: (
        <div className={styles.optionsMenu}>
          <div className={styles.option}>Option-1</div>
          <div className={styles.option}>Option-2</div>
        </div>
      ),
    },
    {
      icon: <PersonStandingIcon />,
      label: "Members",
      dropdownOptions: (
        <div className={styles.optionsMenu}>
          <div className={styles.option}>Option-1</div>
          <div className={styles.option}>Option-2</div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    TaskService.getTaskData(params.id as string, boardId, taskId).then(
      (response) => {
        setTask(response)
      }
    )
  }, [taskId])

  useEffect(() => {
    if (!task) return

    if (task?.description && descriptionEditor) {
      descriptionEditor.commands.setContent(JSON.parse(task.description))
    }
  }, [task, descriptionEditor])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log("FORM SUBMITTED")
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    editor: Editor | null
  ) {
    event.preventDefault()
    const files = event.dataTransfer?.files
    const uploadedFiles = [...files]
    const pos = editor?.state.doc.content.size

    TaskService.uploadImage(
      params.id as string,
      boardId,
      taskId,
      uploadedFiles
    ).then((response) => {
      setTaskImage(response)

      if (response) {
        const imageUrls = response.images.map((image) => image.url)
        setUploadedImages((prev) => {
          return prev ? [...prev, ...imageUrls] : [...imageUrls]
        })

        const chain = editor
          ?.chain()
          .focus()
          .insertContentAt(
            pos ? pos : 0,
            imageUrls.map((url) => {
              return {
                type: "image",
                attrs: {
                  src: `${url}`,
                },
              }
            })
          )

        chain?.run()
      }
    })
  }

  function currentImages(editor: Editor) {
    const html = editor?.getHTML()
    const parser = new DOMParser()

    if (!html) return

    const doc = parser.parseFromString(html, "text/html")

    const currentImages = Array.from(doc.querySelectorAll("img")).map((image) =>
      image.getAttribute("src")
    )

    return currentImages
  }

  function handleUploadImage(
    e: ChangeEvent<HTMLInputElement>,
    editor: Editor | null
  ) {
    const files = e.target.files
    if (!files) return

    const uploadedFiles = [...files]
    const pos = editor?.state.doc.content.size

    TaskService.uploadImage(
      params.id as string,
      boardId,
      taskId,
      uploadedFiles
    ).then((response) => {
      setTaskImage(response)

      if (response) {
        const imageUrls = response.images.map((image) => image.url)
        setUploadedImages((prev) => {
          return prev ? [...prev, ...imageUrls] : [...imageUrls]
        })

        const chain = editor
          ?.chain()
          .focus()
          .insertContentAt(
            pos ? pos : 0,
            imageUrls.map((url) => {
              return {
                type: "image",
                attrs: {
                  src: `${url}`,
                },
              }
            })
          )

        chain?.run()
      }
    })
  }

  return (
    <div className={styles.container}>
      <form
        ref={descriptionAreaRef}
        onSubmit={handleSubmit}
        className={styles.taskDetails}
      >
        <div className={styles.descriptionHeader}>
          <Text />
          Description
        </div>
        {focus ? (
          <div className={styles.markdownArea}>
            <div
              onClick={() => descriptionEditor?.commands.focus()}
              className={styles.editor}
            >
              {descriptionEditor && focus && (
                <MenuBar
                  editor={descriptionEditor}
                  onFileChange={(e) => handleUploadImage(e, descriptionEditor)}
                />
              )}
              <EditorContent
                onDrop={(e) => handleDrop(e, descriptionEditor)}
                className={styles.editorContent}
                onChange={(e) => console.log(e)}
                editor={descriptionEditor}
              />
            </div>
          </div>
        ) : (
          <div className={styles.preview} onClick={() => setFocus(true)}>
            {task ? (
              <EditorContent editor={descriptionEditor} />
            ) : (
              <div>Hi</div>
            )}
          </div>
        )}

        <div className={styles.options}>
          {taskOptions.map((task, index) => {
            return <TaskOption {...task} key={index} />
          })}
        </div>

        {focus && (
          <div className={styles.buttons}>
            <Button
              type="button"
              text="Cancel"
              onClick={() => {
                setFocus(false)

                if (descriptionEditor && task) {
                  descriptionEditor.commands.setContent(
                    JSON.parse(task.description)
                  )
                }
              }}
            />
            <Button
              type="submit"
              text="Save"
              onClick={() => {
                setFocus(false)

                console.log("description", description)

                if (description) {
                  TaskService.uploadDescription(
                    params.id as string,
                    boardId,
                    taskId,
                    description
                  )
                }
              }}
              disabled={
                JSON.parse(JSON.stringify(task?.description)) ===
                JSON.stringify(descriptionEditor?.getJSON().content)
              }
            />
          </div>
        )}
      </form>
      <div className={styles.commentSection}>
        <div className={styles.commentSectionHeader}>
          Comments and activities
        </div>
        <div
          onClick={() => commentEditor?.commands.focus()}
          className={styles.editor}
        >
          {commentEditor && (
            <MenuBar
              editor={commentEditor}
              onFileChange={(e) => handleUploadImage(e, commentEditor)}
            />
          )}
          <EditorContent
            onDrop={(e) => handleDrop(e, commentEditor)}
            className={styles.editorContent}
            onChange={(e) => console.log(e)}
            editor={commentEditor}
          />
          <div className={styles.buttonsWrapper}>
            <div className={styles.buttons}>
              <Button
                type="button"
                text="Save"
                onClick={() => {
                  if (!comment || !user) return
                  TaskService.taskComment(
                    params.id as string,
                    boardId,
                    taskId,
                    comment,
                    user
                  )
                }}
              />
              <Button type="button" text="Cancel" />
            </div>
          </div>
        </div>
        <div className={styles.commentsList}>
          {task?.comments.map((comment) => {
            return (
              <ReadOnlyComment
                key={comment.id}
                comment={comment.content}
                author={comment.author}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
