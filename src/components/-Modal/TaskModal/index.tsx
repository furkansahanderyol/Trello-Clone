import styles from "./index.module.scss"
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { PersonStandingIcon, Plus, Text } from "lucide-react"
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
import {
  editTaskAtom,
  taskAtom,
  taskLabelsAtom,
  userAtom,
  workspaceMembersAtom,
} from "@/store"
import ReadOnlyComment from "@/components/-Tiptap/ReadOnlyComment"
import LabelForm from "@/components/LabelForm"
import { WorkspaceService } from "@/services/workspaceService"
import WorkspaceMember from "@/components/WorkspaceMember"
import TaskMember from "@/components/TaskMember"

interface IProps {
  title: string
  taskId: string
  boardId: string
}

export default function TaskModal({ title, boardId, taskId }: IProps) {
  const [task, setTask] = useAtom(taskAtom)
  const [, setEditTask] = useAtom(editTaskAtom)
  const [taskLabels] = useAtom(taskLabelsAtom)
  const [workspaceMembers, setWorkspaceMembers] = useAtom(workspaceMembersAtom)
  const [user] = useAtom(userAtom)
  const descriptionAreaRef = useRef<HTMLFormElement | null>(null)
  const [focus, setFocus] = useState(false)
  const [description, setDescription] = useState<JSONContent>()
  const [comment, setComment] = useState<JSONContent>()
  const [editedComment, setEditedComment] = useState<JSONContent>()
  const params = useParams()
  const [, setTaskImage] = useState<UploadImageResponse | undefined>()
  const [, setUploadedImages] = useState<(string | null)[] | undefined>(
    undefined
  )
  // const [assignedTaskMembers] = useState()
  const [addLabel] = useState(true)

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
    immediatelyRender: false,
    onUpdate({ editor }) {
      const uploadedImages = currentImages(editor)
      const json = editor.getJSON()
      setUploadedImages(uploadedImages)
      setComment(json)
    },
    onContentError({ error }) {
      console.log("Tiptap Error", error)
    },
  })

  const commentEditEditor = useEditor({
    extensions: [StarterKit, Image],
    immediatelyRender: false,
    onUpdate({ editor }) {
      const uploadedImages = currentImages(editor)
      const json = editor.getJSON()
      setUploadedImages(uploadedImages)
      setEditedComment(json)
    },
  })

  const taskOptions = [
    {
      icon: <Plus />,
      label: "Labels",
      dropdownOptions: addLabel ? <LabelForm /> : <div>Hi</div>,
    },
    {
      icon: <PersonStandingIcon />,
      label: "Members",
      dropdownOptions: (
        <div className={styles.optionsMenu}>
          {workspaceMembers ? (
            workspaceMembers.map((member, index) => {
              return (
                <WorkspaceMember
                  onClick={() => {
                    TaskService.addMemberToTask(member.email, taskId)
                  }}
                  key={index}
                  member={member}
                />
              )
            })
          ) : (
            <div>No data</div>
          )}
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
      commentEditEditor?.commands.setContent(JSON.parse(task.description))
    }
  }, [task, descriptionEditor])

  useEffect(() => {
    if (task?.id && params.id) {
      TaskService.getAvailableTaskMembers(params.id as string, task?.id).then(
        (response) => {
          setWorkspaceMembers(response)
        }
      )
    }
  }, [params.id, task?.id])

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
      <div className={styles.wrapper}>
        <div className={styles.options}>
          {taskOptions.map((task, index) => {
            return <TaskOption {...task} key={index} />
          })}
        </div>
        <div className={styles.activeLabels}>
          {taskLabels &&
            taskLabels.map((data) => {
              if (!data.isActive) return

              return (
                <div
                  key={data.label.id}
                  className={styles.activeLabel}
                  style={{
                    backgroundColor: data.label.color,
                  }}
                >
                  {data.label.name}
                </div>
              )
            })}
        </div>
        <div className={styles.taskMembers}>
          {task?.assignedUsers.map((user, index) => {
            return (
              <TaskMember
                key={index}
                name={user.user.name}
                surname={user.user.surname}
                email={user.user.email}
                profileImage={user.user.profileImage}
                onClick={() =>
                  TaskService.unassignUser(task.id, user.user.email).then(
                    (response) => console.log("response", response)
                  )
                }
              />
            )
          })}
        </div>
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
                    onFileChange={(e) =>
                      handleUploadImage(e, descriptionEditor)
                    }
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
      </div>

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
              <div key={comment.id} className={styles.comment}>
                <ReadOnlyComment
                  editor={commentEditEditor}
                  comment={comment.content}
                  author={comment.author}
                  boardId={boardId}
                  taskId={taskId}
                  commentId={comment.id}
                  markdownTextarea={
                    <div className={styles.editComment}>
                      <div className={styles.markdownArea}>
                        {commentEditEditor && (
                          <MenuBar
                            editor={commentEditEditor}
                            onFileChange={(e) => console.log(e)}
                          />
                        )}
                        <EditorContent
                          onDrop={(e) => handleDrop(e, commentEditEditor)}
                          className={styles.editorContent}
                          onChange={(e) => console.log(e)}
                          editor={commentEditEditor}
                        />
                      </div>
                      <div className={styles.buttonsWrapper}>
                        <div className={styles.buttons}>
                          <Button
                            type="button"
                            text="Save"
                            onClick={() => {
                              if (!editedComment || !user) return
                              TaskService.updateTaskComment(
                                params.id as string,
                                boardId,
                                taskId,
                                comment.id,
                                editedComment
                              )
                            }}
                            disabled={
                              JSON.parse(JSON.stringify(comment.content)) ===
                              JSON.stringify(
                                commentEditEditor?.getJSON().content
                              )
                            }
                          />
                          <Button
                            type="button"
                            text="Cancel"
                            onClick={() => {
                              setEditTask(false)
                              if (commentEditEditor && comment) {
                                commentEditEditor.commands.setContent(
                                  JSON.parse(comment.content)
                                )
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
