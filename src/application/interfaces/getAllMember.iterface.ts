export interface GetAllMembersResponse {
  members: Array<{
    id: string;
    name: string;
    email: string;
    comments: string;
    dni: string;
    memberNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
