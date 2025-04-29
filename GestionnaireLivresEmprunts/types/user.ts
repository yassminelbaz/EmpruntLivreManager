export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
export type Role = 'admin' | 'etudiant';