import styles from "./index.module.scss"
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import clsx from "clsx"
import { PersonStandingIcon, Plus } from "lucide-react"
import TaskOption from "@/components/TaskOption"
import Button from "@/components/Button"
import { TaskService } from "@/services/taskService"
import { useParams } from "next/navigation"
import { UploadImageResponse } from "@/services/type"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import MenuBar from "@/components/-Tiptap/MenuBar"
import Image from "@tiptap/extension-image"
interface IProps {
  title: string
  taskId: string
  boardId: string
}

export default function TaskModal({ title, boardId, taskId }: IProps) {
  const descriptionAreaRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [focus, setFocus] = useState(false)
  const [description, setDescription] = useState("Default description.")
  const caretPositionRef = useRef<HTMLTextAreaElement | null>(null)
  const params = useParams()
  const [taskImage, setTaskImage] = useState<UploadImageResponse | undefined>()
  const [uploadedImages, setUploadedImages] = useState<string[] | undefined>(
    undefined
  )

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      const deleted = getDeletedImages()

      // setEditorContent(editor.getHTML())
    },
    editorProps: {
      handleDrop(view, event) {
        console.log("view", view)
        console.log("event", event)
      },
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

  useOnClickOutside(descriptionAreaRef, () => {
    setFocus(false)
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log("FORM SUBMITTED")
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const files = event.dataTransfer?.files
    const uploadedFiles = [...files]

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
          .insertContent(
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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {}

  function getDeletedImages() {
    const html = editor?.getHTML()
    const parser = new DOMParser()

    if (!html) return

    const doc = parser.parseFromString(html, "text/html")

    const currentImages = Array.from(doc.querySelectorAll("img")).map((image) =>
      image.getAttribute("src")
    )

    const deletedImages = uploadedImages?.filter(
      (image) => !currentImages.includes(image)
    )
    // console.log(deletedImages)

    return deletedImages
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
              onClick={() => editor?.commands.focus()}
              className={styles.editor}
            >
              {editor && <MenuBar editor={editor} />}
              <EditorContent
                onDrop={handleDrop}
                className={styles.editorContent}
                onChange={(e) => console.log(e)}
                editor={editor}
              />
            </div>
            <div className={styles.dropzone}>
              <input
                ref={inputRef}
                type="file"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
        ) : (
          <div className={styles.preview} onClick={() => setFocus(true)}>
            {description}
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
              }}
            />
          </div>
        )}
      </form>
      <div className={styles.commentSection}></div>
    </div>
  )
}
