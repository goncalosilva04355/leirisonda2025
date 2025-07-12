// Redirecionamento para o authService correto
// Este arquivo resolve imports quebrados de '../services/authService'

export { authService, UserProfile } from "./firebaseAuthService";
export type { UserProfile as AuthUserProfile } from "./firebaseAuthService";
export default authService;
