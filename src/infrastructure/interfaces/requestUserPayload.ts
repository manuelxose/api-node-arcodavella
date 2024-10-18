// src/infrastructure/interfaces/requestUserPayload.ts

export interface RequestUserPayload {
  username: string;
  role: string;
  email: string;
  // Añade otros campos que consideres necesarios
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUserPayload; // Información del usuario autenticado
      loginCount?: number; // Número total de inicios de sesión
    }
  }
}

export {}; // Asegura que este archivo sea tratado como un módulo
