import { StatusCodes, UserRoles } from "../../domain/enums";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    role: UserRoles;
    memberNumber?: string;
    status: StatusCodes;
    name?: string;
    phone?: string;
    dni?: string;
    accountNumber?: string;
    updatedAt?: Date;
  };
  token: string;
}
