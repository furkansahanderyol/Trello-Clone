import styles from "./index.module.scss"
import React, { ChangeEvent, FormEvent, useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { PersonStandingIcon, Plus } from "lucide-react"
import TaskOption from "@/components/TaskOption"
import Button from "@/components/Button"
import { TaskService } from "@/services/taskService"
import { useParams } from "next/navigation"
import { UploadImageResponse } from "@/services/type"
import {
  Editor,
  EditorContent,
  generateJSON,
  JSONContent,
  useEditor,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import MenuBar from "@/components/-Tiptap/MenuBar"
import Image from "@tiptap/extension-image"
import { generateHTML } from "@tiptap/react"
interface IProps {
  title: string
  taskId: string
  boardId: string
}

export default function TaskModal({ title, boardId, taskId }: IProps) {
  const descriptionAreaRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [focus, setFocus] = useState(true)
  const [description, setDescription] = useState<JSONContent>()
  const caretPositionRef = useRef<HTMLTextAreaElement | null>(null)
  const params = useParams()
  const [taskImage, setTaskImage] = useState<UploadImageResponse | undefined>()
  const [uploadedImages, setUploadedImages] = useState<
    (string | null)[] | undefined
  >(undefined)

  const descriptionEditor = useEditor({
    extensions: [StarterKit, Image],
    content: description
      ? generateHTML(description, [StarterKit, Image])
      : "Enter more detailed description...",
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

      setUploadedImages(uploadedImages)
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

  // useOnClickOutside(descriptionAreaRef, () => {
  //   setFocus(false)
  // })

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
        {focus ? (
          <div className={styles.markdownArea}>
            <div
              onClick={() => descriptionEditor?.commands.focus()}
              className={styles.editor}
            >
              {descriptionEditor && (
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
            {generateHTML(description!, [StarterKit, Image])}
          </div>
        )}

        <div className={styles.options}>
          {taskOptions.map((task, index) => {
            return <TaskOption {...task} key={index} />
          })}
        </div>

        {focus && (
          <div className={styles.buttons}>
            <Button type="button" text="Cancel" />
            <Button
              type="submit"
              text="Save"
              onClick={() => {
                setFocus(false)

                if (description) {
                  TaskService.uploadDescription(
                    params.id as string,
                    boardId,
                    taskId,
                    description
                  )
                }
              }}
            />
          </div>
        )}
      </form>
      <div className={styles.commentSection}>
        <div className={styles.commentSectionHeader}>
          Comments and activities
        </div>
        <div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
