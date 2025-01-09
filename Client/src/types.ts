// types.ts (or inline in your component file)
export interface SessionUser {
    id: string | null;
    name: string | undefined;
    email: string | undefined;
    username: string | undefined;
    image: string | undefined;
    provider?: string;
  }

  // types.ts
export interface UserProps {
    username?: string;
    image?: string;
  }
  
  