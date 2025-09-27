export interface User {
  id: string;
  email: string;
  name: string;
  last_name: string;
  created_at: Date;
  updated_at?: Date;
}

export interface UserProfile extends User {
  // Propiedades adicionales del perfil si las hay
}
