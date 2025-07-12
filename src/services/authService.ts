// Redirecionamento para o authService correto
// Este arquivo resolve imports quebrados de '../services/authService'

export { authService } from "./firebaseAuthService";
export { UserProfile } from "./localAuthService";
export type { UserProfile as AuthUserProfile } from "./localAuthService";

import { authService } from "./firebaseAuthService";
export default authService;
