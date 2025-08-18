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
