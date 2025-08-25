import clsx from "clsx"
import styles from "./index.module.scss"
import { Edit, X } from "lucide-react"
import { FormEvent, useEffect, useMemo, useState } from "react"
import Input from "@/components/Input"
import Button from "../Button"
import { useAtom } from "jotai"
import { taskAtom, taskLabelsAtom } from "@/store"
import Checkbox from "../Checkbox"
import { LabelType } from "@/store/types"
import { useDebounce } from "@/hooks/useDebounce"
import { TaskService } from "@/services/taskService"
import { useParams } from "next/navigation"

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
  const [taskLabels, setTaskLabels] = useAtom(taskLabelsAtom)
  const params = useParams()
  const [color, setColor] = useState(COLOR_OPTIONS[0])
  const [header, setHeader] = useState("")
  const [addNewLabel, setAddNewLabel] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([])
  const [editLabelInfo, setEditLabelInfo] = useState<LabelType | undefined>(
    undefined
  )
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    if (task) {
      TaskService.getTaskLabels(
        params.id as string,
        task?.boardId,
        task?.id
      ).then((response) => {
        setTaskLabels(response.labels)
      })
    }
  }, [task])

  function handleLabelCreate(e: FormEvent) {
    e.preventDefault()

    if (!task) return

    if (editLabelInfo) {
      TaskService.editTaskLabel(
        params.id as string,
        task?.boardId,
        task?.id,
        editLabelInfo.id,
        header,
        color
      ).then((response) => {
        setTaskLabels(response.labels)
        setAddNewLabel(false)
      })
    } else {
      TaskService.createTaskLabel(
        params.id as string,
        task?.boardId,
        task?.id,
        header,
        color
      ).then((response) => {
        setTaskLabels(response.labels)
        setAddNewLabel(false)
      })
    }
  }

  const searchedLabelsInput = useDebounce(searchInput, 300)
  const searchedLabels = useMemo(() => {
    if (searchInput === "") return undefined
    if (!taskLabels) return

    return taskLabels.filter((label) => {
      const labelName = label.name.toLowerCase().replace(/\s/g, "")
      const searchedValue = searchedLabelsInput.toLowerCase().replace(/\s/g, "")

      return labelName.includes(searchedValue)
    })
  }, [taskLabels, searchedLabelsInput])

  return taskLabels && !addNewLabel ? (
    <div className={styles.container}>
      <div className={styles.header}>Labels</div>
      {taskLabels.length !== 0 && (
        <>
          <div className={styles.searchInputWrapper}>
            <Input
              placeholder="Search labels"
              className={styles.searchInput}
              onChange={(e) => setSearchInput(e)}
            />
          </div>
          <div className={styles.labelList}>
            {searchedLabels ? (
              searchedLabels.length > 0 ? (
                searchedLabels.map((label) => {
                  return (
                    <div
                      onClick={() =>
                        setSelectedLabels((prev) => {
                          if (prev.includes(label)) {
                            const updatedLabels = prev.filter(
                              (prevLabels) => prevLabels.id !== label.id
                            )

                            return updatedLabels
                          }

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
                      <div
                        onClick={() => {
                          setAddNewLabel(true)
                          setEditLabelInfo(label)
                        }}
                        className={styles.editButton}
                      >
                        <Edit />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div>No data</div>
              )
            ) : (
              !searchedLabels &&
              taskLabels.map((label) => {
                return (
                  <div
                    onClick={() =>
                      setSelectedLabels((prev) => {
                        if (prev.includes(label)) {
                          const updatedLabels = prev.filter(
                            (prevLabels) => prevLabels.id !== label.id
                          )

                          return updatedLabels
                        }

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
                    <div
                      onClick={() => {
                        setAddNewLabel(true)
                        setEditLabelInfo(label)
                        setHeader(label.name)
                      }}
                      className={styles.editButton}
                    >
                      <Edit />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

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
      onSubmit={handleLabelCreate}
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
            backgroundColor: editLabelInfo?.color ? editLabelInfo.color : color,
          }}
        >
          {editLabelInfo?.name ? editLabelInfo.name : header}
        </div>
      </div>
      <div className={styles.options}>
        <Input
          className={styles.headerInput}
          label="Header"
          type="text"
          onChange={(e) => setHeader(e)}
          defaultValue={editLabelInfo ? editLabelInfo.name : ""}
        />
        <div className={styles.colorHeader}>Choose color</div>
        <div className={styles.colorsWrapper}>
          {COLOR_OPTIONS.map((color, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setColor(color)
                  setEditLabelInfo((prev) => {
                    const updatedLabel = { ...prev, color: color }

                    return updatedLabel as LabelType
                  })
                }}
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
        <Button type="submit" text={editLabelInfo ? "Edit" : "Create"} />
        {editLabelInfo && (
          <Button
            type="button"
            onClick={() => {
              if (!task) return
              TaskService.deleteTaskLabel(
                params.id as string,
                task?.boardId,
                task?.id,
                editLabelInfo.id
              ).then((response) => {
                setTaskLabels(response.labels)
              })

              setEditLabelInfo(undefined)
              setAddNewLabel(false)
            }}
            text={"Delete"}
            className={styles.deleteButton}
          />
        )}
      </div>
    </form>
  )
}
