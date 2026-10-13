import { getAccessToken, auth, isAuthorizedSheetsEmail, AUTHORIZED_SHEETS_EMAIL } from "./googleAuth";
import { UserProfile, MoodCheckIn } from "../types";

export { AUTHORIZED_SHEETS_EMAIL, isAuthorizedSheetsEmail };

export interface SheetDatabaseInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  lastSyncedAt?: string;
  totalUsersSynced?: number;
  totalLogsSynced?: number;
}

const STORAGE_KEY_SHEET_ID = "mind_merit_google_sheets_id";
const STORAGE_KEY_LAST_SYNC = "mind_merit_google_sheets_last_sync";

export const getSavedSpreadsheetId = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_SHEET_ID);
};

export const saveSpreadsheetId = (id: string) => {
  localStorage.setItem(STORAGE_KEY_SHEET_ID, id);
};

export const getSpreadsheetUrl = (spreadsheetId: string) => {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
};

/**
 * Creates a structured Google Sheet for Email Directory (Strict Privacy - Zero Personal Data)
 */
export const createDatabaseSpreadsheet = async (): Promise<SheetDatabaseInfo> => {
  if (!auth.currentUser || !isAuthorizedSheetsEmail(auth.currentUser.email)) {
    throw new Error(`ไม่อนุญาต: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้นที่มีสิทธิ์สร้างหรือเข้าถึง Google Sheets`);
  }

  const token = await getAccessToken();
  if (!token) {
    throw new Error("No Google access token found. Please sign in with Google first.");
  }

  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: "MIND MERIT - User Emails & Verification (Strict Privacy - Email Only)",
      },
      sheets: [
        {
          properties: {
            title: "Users",
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to create Google Spreadsheet");
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  saveSpreadsheetId(spreadsheetId);

  // Set up header columns for Users sheet (Email only, no personal data)
  await initializeSheetHeaders(spreadsheetId, token);

  return {
    spreadsheetId,
    spreadsheetUrl: getSpreadsheetUrl(spreadsheetId),
  };
};

/**
 * Populates header rows for Users sheet (Zero personal data - strictly Email only)
 */
const initializeSheetHeaders = async (spreadsheetId: string, token: string) => {
  const userHeaders = [
    [
      "Registered At (วัน-เวลา)",
      "User Email (อีเมลผู้ใช้ - ข้อมูลเดียวที่จัดเก็บ)",
      "Verification Status (สถานะยืนยันตัวตน)",
      "Privacy Policy (นโยบายความเป็นส่วนตัว)",
    ],
  ];

  await updateSheetRange(spreadsheetId, "Users!A1:D1", userHeaders, token);
};

const updateSheetRange = async (
  spreadsheetId: string,
  range: string,
  values: any[][],
  token: string
) => {
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );
};

const appendSheetRows = async (
  spreadsheetId: string,
  range: string,
  values: any[][],
  token: string
) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Failed to append data to ${range}`);
  }

  return response.json();
};

/**
 * Sync all registered users to the Google Sheet
 */
export const syncAllUsersToSheet = async (
  users: UserProfile[],
  spreadsheetId?: string
): Promise<{ count: number; spreadsheetUrl: string }> => {
  if (!auth.currentUser || !isAuthorizedSheetsEmail(auth.currentUser.email)) {
    throw new Error(`ไม่อนุญาต: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้นที่มีสิทธิ์ซิงค์ข้อมูล Google Sheets`);
  }

  const targetId = spreadsheetId || getSavedSpreadsheetId();
  if (!targetId) {
    throw new Error("No Google Spreadsheet configured. Please create or link one first.");
  }

  const token = await getAccessToken();
  if (!token) {
    throw new Error("No Google access token found. Please sign in with Google.");
  }

  // STRICT PRIVACY: Zero personal data - collect ONLY Email and verification status
  const rows = users
    .map((u) => {
      const emailAddr = u.email || (u.emailOrPhone?.includes("@") ? u.emailOrPhone : null);
      if (!emailAddr) return null;
      return [
        u.emailVerifiedAt || u.lastVisitDate || new Date().toISOString(),
        emailAddr,
        u.isEmailVerified ? "Verified (ยืนยันแล้ว)" : "Unverified (รอการยืนยัน)",
        "Zero Personal Data Policy Enforced (คุ้มครองข้อมูลส่วนบุคคล 100%)",
      ];
    })
    .filter(Boolean) as any[][];

  await initializeSheetHeaders(targetId, token);

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${targetId}/values/Users!A2:D1000:clear`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (rows.length > 0) {
    await updateSheetRange(targetId, `Users!A2:D${rows.length + 1}`, rows, token);
  }

  const now = new Date().toLocaleString("th-TH");
  localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);

  return {
    count: rows.length,
    spreadsheetUrl: getSpreadsheetUrl(targetId),
  };
};

/**
 * Mood logs sync: Strictly disabled for external sync to ensure 100% privacy
 * "ห้าม เข้าถึงข้อมูลส่วนตัวของผู้ใช้เด็ดขาด เอาแค่ อีเมล เฉยๆ"
 */
export const syncMoodLogsToSheet = async (
  _logs: MoodCheckIn[],
  _userName: string,
  _spreadsheetId?: string
): Promise<{ count: number; message: string }> => {
  // STRICT PRIVACY: Personal mood journals and mental health logs are confidential to the user's device
  return { 
    count: 0,
    message: "ข้อมูลบันทึกอารมณ์และบันทึกส่วนตัวถูกล็อกความเป็นส่วนตัวสูงสุด (ไม่ส่งออกไปยังชีตภายนอก ตามนโยบาย 'เอาแค่อีเมลเฉยๆ')" 
  };
};

/**
 * Appends a single newly registered user to the spreadsheet in real time (ONLY Email)
 */
export const appendSingleUserToSheet = async (user: UserProfile) => {
  const targetId = getSavedSpreadsheetId();
  if (!targetId) return;

  const userEmail = user.email || (user.emailOrPhone?.includes("@") ? user.emailOrPhone : undefined);
  if (!userEmail) return;

  const token = await getAccessToken();
  if (!token) return;

  // STRICT PRIVACY: Only email is saved
  const row = [
    new Date().toISOString(),
    userEmail,
    user.isEmailVerified ? "Verified (ยืนยันแล้ว)" : "Unverified (รอการยืนยัน)",
    "Zero Personal Data Policy Enforced",
  ];

  try {
    await appendSheetRows(targetId, "Users!A:D", [row], token);
  } catch (err) {
    console.error("Auto-sync email to Google Sheets failed:", err);
  }
};

/**
 * Appends mood check-in: Disabled to enforce strict user privacy
 */
export const appendSingleMoodLogToSheet = async (_log: MoodCheckIn, _userName: string) => {
  // STRICT PRIVACY: Personal diaries are never uploaded to Google Sheets
};

