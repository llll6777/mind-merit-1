import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const AUTHORIZED_SHEETS_EMAIL = "alisa.yama2006@gmail.com";

export const isAuthorizedSheetsEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_SHEETS_EMAIL.toLowerCase();
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (!isAuthorizedSheetsEmail(user.email)) {
        await auth.signOut();
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
        return;
      }
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const userEmail = result.user.email;

    // Strict Authorization: ONLY alisa.yama2006@gmail.com is allowed to access Google Sheets
    if (!isAuthorizedSheetsEmail(userEmail)) {
      await auth.signOut();
      cachedAccessToken = null;
      throw new Error(
        `⛔ บัญชี ${userEmail || "นี้"} ไม่มีสิทธิ์เข้าถึงข้อมูล Google Sheets (ระบบจำกัดสิทธิ์เฉพาะ ${AUTHORIZED_SHEETS_EMAIL} เท่านั้น)`
      );
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!auth.currentUser || !isAuthorizedSheetsEmail(auth.currentUser.email)) {
    return null;
  }
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
