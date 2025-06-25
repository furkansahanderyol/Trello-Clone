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
