import clsx from "clsx"
import styles from "./index.module.scss"
import { X } from "lucide-react"
import { FormEvent, useState } from "react"
import Input from "@/components/Input"
import Button from "../Button"
import { useAtom } from "jotai"
import { taskAtom } from "@/store"

interface IProps {
  className?: string
}

const COLOR_OPTIONS = [
  "#d40000",
  "#234dfa",
  "#dfa251",
  "#491dff",
  "#e36af3",
  "#ff0ff2",
  "#d40000",
  "#234dfa",
  "#dfa251",
  "#491dff",
  "#e36af3",
  "#ff0ff2",
]

export default function LabelForm({ className }: IProps) {
  const [task] = useAtom(taskAtom)
  const [color, setColor] = useState("#d40000")
  const [header, setHeader] = useState("")

  function handleLabelCreate() {
    console.log("Label created")
    return
  }

  return task?.labels ? (
    <div>Empty label form</div>
  ) : (
    <form
      onClick={handleLabelCreate}
      className={clsx(styles.container, className)}
    >
      <div className={styles.headerWrapper}>
        <div className={styles.header}>Create a Label</div>
        <X />
      </div>
      <div className={styles.preview}>
        <div
          className={styles.color}
          style={{
            backgroundColor: color,
          }}
        >
          {header}
        </div>
      </div>
      <div className={styles.options}>
        <Input
          className={styles.headerInput}
          label="Header"
          type="text"
          onChange={(e) => setHeader(e)}
        />
        <div className={styles.colorHeader}>Choose color</div>
        <div className={styles.colorsWrapper}>
          {COLOR_OPTIONS.map((color, index) => {
            return (
              <div
                key={index}
                onClick={() => setColor(color)}
                className={styles.color}
                style={{
                  backgroundColor: color,
                }}
              />
            )
          })}
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button type="submit" text="Create" disabled={header === ""} />
      </div>
    </form>
  )
}
