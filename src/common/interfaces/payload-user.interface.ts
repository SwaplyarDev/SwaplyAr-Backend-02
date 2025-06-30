export interface JwtPayloadUser {
  id: string;
  email?: string;
  roles?: string[];
}
