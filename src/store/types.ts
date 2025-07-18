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
}[]

export type TaskType = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  boardId: string
  assignedToId: string
}

export type BoardMemberType = {
  id: string
  userId: string
  boardId: string
  role: string
}
