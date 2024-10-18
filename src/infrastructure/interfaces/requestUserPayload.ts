// Define your user payload interface
export interface RequestUserPayload {
  username: string;
  role: string;
  email: string;
  // Add other fields as necessary
}

// Augment the Express Request interface
declare module "express-serve-static-core" {
  interface Request {
    user?: RequestUserPayload; // Information about the authenticated user
    loginCount?: number; // Total number of logins
  }
}

export {}; // Ensure this file is treated as an ES module
