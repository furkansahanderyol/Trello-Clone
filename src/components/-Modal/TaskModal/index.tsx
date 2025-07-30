import styles from "./index.module.scss"
import Textarea from "@/components/Textarea"
import { useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import clsx from "clsx"
import { PersonStandingIcon, Plus } from "lucide-react"
import TaskOption from "@/components/TaskOption"
import Button from "@/components/Button"

interface IProps {
  title: string
}

export default function TaskModal({ title }: IProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [focus, setFocus] = useState(false)

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

  useOnClickOutside(textareaRef, () => {
    setFocus(false)
  })

  return (
    <div className={styles.container}>
      <div className={styles.taskDetails}>
        <Textarea
          ref={textareaRef}
          className={clsx(styles.description, focus && styles.textareaFocused)}
          defaultValue={
            "Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card...Add more detailed description for your card..."
          }
          onClick={() => setFocus(true)}
        />

        <div className={styles.options}>
          {taskOptions.map((task, index) => {
            return <TaskOption {...task} key={index} />
          })}
        </div>

        {focus && (
          <div className={styles.buttons}>
            <Button type="button" text="Cancel" />
            <Button type="button" text="Save" />
          </div>
        )}
      </div>
      <div className={styles.commentSection}></div>
    </div>
  )
}
