import { Editor, useEditorState } from "@tiptap/react"
import styles from "./styles.module.scss"
import clsx from "clsx"
import {
  Bold,
  CaseSensitive,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Image,
  Italic,
  List,
  ListOrdered,
  TypeOutline,
  WrapText,
} from "lucide-react"
import { useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"

export default function MenuBar({ editor }: { editor: Editor }) {
  const optionsRef = useRef<HTMLDivElement | null>(null)
  const [optionsVisible, setOptionsVisible] = useState(false)
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
      }
    },
  })

  useOnClickOutside(optionsRef, () => {
    setOptionsVisible(false)
  })

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={clsx(
            styles.button,
            editorState.isBold ? styles.active : undefined
          )}
        >
          <Bold className={styles.icon} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={clsx(
            styles.button,
            editorState.isItalic ? styles.active : undefined
          )}
        >
          <Italic className={styles.icon} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={clsx(
            styles.button,
            editorState.isStrike ? styles.active : undefined
          )}
        >
          <TypeOutline className={styles.icon} />
        </button>

        <div
          onClick={() => setOptionsVisible(!optionsVisible)}
          className={styles.headings}
        >
          <CaseSensitive />
          <div
            ref={optionsRef}
            className={clsx(
              styles.options,
              optionsVisible && styles.optionsVisible
            )}
          >
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={clsx(
                styles.button,
                editorState.isHeading1 ? styles.active : undefined
              )}
            >
              <Heading1 className={styles.icon} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={clsx(
                styles.button,
                editorState.isHeading2 ? styles.active : undefined
              )}
            >
              <Heading2 className={styles.icon} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={clsx(
                styles.button,
                editorState.isHeading3 ? styles.active : undefined
              )}
            >
              <Heading3 className={styles.icon} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={clsx(
                styles.button,
                editorState.isHeading4 ? styles.active : undefined
              )}
            >
              <Heading4 className={styles.icon} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={clsx(
                styles.button,
                editorState.isHeading5 ? styles.active : undefined
              )}
            >
              <Heading5 className={styles.icon} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              className={clsx(
                styles.button,
                editorState.isHeading6 ? styles.active : undefined
              )}
            >
              <Heading6 className={styles.icon} />
            </button>
          </div>
        </div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={clsx(
            styles.button,
            editorState.isBulletList ? styles.active : undefined
          )}
        >
          <List className={styles.icon} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={clsx(
            styles.button,
            editorState.isOrderedList ? styles.active : undefined
          )}
        >
          <ListOrdered className={styles.icon} />
        </button>
        <div className={styles.button}>
          <Image className={styles.icon} />
        </div>
      </div>
    </div>
  )
}
