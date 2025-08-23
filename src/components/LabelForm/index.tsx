import clsx from "clsx"
import styles from "./index.module.scss"
import { Edit, X } from "lucide-react"
import { FormEvent, useState } from "react"
import Input from "@/components/Input"
import Button from "../Button"
import { useAtom } from "jotai"
import { taskAtom } from "@/store"
import Checkbox from "../Checkbox"
import { LabelType } from "@/store/types"

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

const LABELS = [
  {
    id: "1",
    name: "Label 1",
    color: "#d40000",
  },
  {
    id: "2",
    name: "Label 2",
    color: "#ff0ff2",
  },
  {
    id: "3",
    name: "Label 3",
    color: "#491dff",
  },
  {
    id: "4",
    name: "Label 4",
    color: "#dfa251",
  },
]

export default function LabelForm({ className }: IProps) {
  const [task] = useAtom(taskAtom)
  const [color, setColor] = useState("#d40000")
  const [header, setHeader] = useState("")
  const [addNewLabel, setAddNewLabel] = useState(false)

  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([])

  function handleLabelCreate() {
    console.log("Label created")
    return
  }

  return LABELS && !addNewLabel ? (
    <div className={styles.container}>
      <div className={styles.header}>Labels</div>
      <div className={styles.searchInputWrapper}>
        <Input placeholder="Search labels" className={styles.searchInput} />
      </div>
      <div className={styles.labelList}>
        {LABELS.map((label) => {
          return (
            <div
              onClick={() =>
                setSelectedLabels((prev) => {
                  return [...prev, label]
                })
              }
              key={label.id}
              className={styles.labelWrapper}
            >
              <Checkbox checked={selectedLabels.includes(label)} />
              <div
                className={styles.label}
                style={{
                  backgroundColor: label.color,
                }}
              >
                {label.name}
              </div>
              <div className={styles.editButton}>
                <Edit />
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.createNewLabelButton}>
        <Button
          onClick={() => setAddNewLabel(true)}
          text={"Create new label"}
          type="button"
        />
      </div>
    </div>
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
