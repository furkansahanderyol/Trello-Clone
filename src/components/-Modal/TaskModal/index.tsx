import styles from "./index.module.scss"
import Textarea from "@/components/Textarea"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import clsx from "clsx"
import { PersonStandingIcon, Plus } from "lucide-react"
import TaskOption from "@/components/TaskOption"
import Button from "@/components/Button"
import MDEditor, {
  commands,
  ICommand,
  TextAreaTextApi,
} from "@uiw/react-md-editor"

interface IProps {
  title: string
}

export default function TaskModal({ title }: IProps) {
  const descriptionAreaRef = useRef<HTMLFormElement | null>(null)
  const [focus, setFocus] = useState(false)
  const [description, setDescription] = useState("")

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

  const insertImage: ICommand = {
    name: "image-upload",
    keyCommand: "image-upload",
    buttonProps: { "aria-label": "Insert Image" },
    icon: <span>🖼️</span>,
    execute: (state, api) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.style.display = "none"

      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
          const imageDataUrl = reader.result
          const markdownImage = `![](${imageDataUrl})`

          api.replaceSelection(markdownImage)
        }
        reader.readAsDataURL(file)
      }

      document.body.appendChild(input)
      input.click()
      document.body.removeChild(input)
    },
  }

  return (
    <div className={styles.container}>
      <form
        ref={descriptionAreaRef}
        onSubmit={handleSubmit}
        className={styles.taskDetails}
      >
        {focus ? (
          <MDEditor
            className={clsx(
              styles.description,
              focus && styles.textareaFocused
            )}
            value={description}
            onChange={(e) => {
              e ? setDescription(e) : setDescription("")
            }}
            fullscreen={false}
            preview={"edit"}
            commands={[...commands.getCommands(), insertImage]}
            onDrop={() => console.log("dropped")}
            visibleDragbar={false}
            draggable={false}
            height={200}
            extraCommands={[]}
            textareaProps={{
              placeholder: "Add more detailed description...",
            }}
          />
        ) : (
          <div onClick={() => setFocus(true)}>
            <MDEditor.Markdown
              className={styles.markdown}
              source={
                description ? description : "Add more detailed description..."
              }
              style={{ whiteSpace: "pre-wrap" }}
            />
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
