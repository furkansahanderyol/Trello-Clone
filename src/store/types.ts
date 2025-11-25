export type AllWorkspacesType = {
  id: string
  role: string
  userId: string
  workspace: WorkspaceType
  workspaceId: string
}

export type WorkspaceType = {
  color: string
  cratedAt: string
  createdBy: string
  id: string
  name: string
}

export type BoardType = {
  id: string
  title: string
  createdAt: string
  workspaceId: string
  tasks: TaskType[]
  members: BoardMemberType[]
  order: number
}[]

export type TaskType = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  boardId: string
  assignedToId: string
  order: number
  comments: CommentType[]
  labels: LabelType[]
  assignedUsers: {
    taskId: string
    user: UserType
  }[]
}

export type BoardMemberType = {
  id: string
  userId: string
  boardId: string
  role: string
}

export type UserType = {
  name: string
  surname: string
  email: string
  profileImage: string | undefined
}

export type CommentType = {
  id: string
  author: AuthorType
  authorId: string
  content: string
  createdAt: string
  order: number
  taskId: string
}

export type AuthorType = {
  id: string
  name: string
  surname: string
  email: string
  profileImage: string
}

export type LabelType = {
  isActive: boolean
  label: {
    id: string
    name: string
    color: string
  }
}

export type NotificationsType = {
  id: string
  createdAt: string
  workspaceId: string
  type: "workspace-invite" | "board-update"
  message: string
  senderName: string
  senderSurname: string
  senderProfileImage: string | undefined
  workspaceName: string
  read: boolean
}

export type NotificationsDataType = {
  count: number
  notifications: NotificationsType[]
}

export type WorkspaceMember = {
  email: string
  name: string
  surname: string
  role: "admin" | "member"
  profileImage: string
}
