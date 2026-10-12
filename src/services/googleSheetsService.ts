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
 * Creates a structured Google Sheet with 3 worksheets (Users, MoodLogs, Certificates)
 */
export const createDatabaseSpreadsheet = async (): Promise<SheetDatabaseInfo> => {
  if (!auth.currentUser || !isAuthorizedSheetsEmail(auth.currentUser.email)) {
    throw new Error(`ไม่อนุญาต: เฉพาะบัญชี ${AUTHORIZED_SHEETS_EMAIL} เท่านั้นที่มีสิทธิ์สร้างหรือเข้าถึง Google Sheets`);
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
        title: "MIND MERIT - Database & User Records (Admin Private)",
      },
      sheets: [
        {
          properties: {
            title: "Users",
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: "MoodLogs",
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: "Certificates",
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

  // Set up header columns for each sheet
  await initializeSheetHeaders(spreadsheetId, token);

  return {
    spreadsheetId,
    spreadsheetUrl: getSpreadsheetUrl(spreadsheetId),
  };
};

/**
 * Populates header rows for Users, MoodLogs, and Certificates
 */
const initializeSheetHeaders = async (spreadsheetId: string, token: string) => {
  const userHeaders = [
    [
      "Registered At",
      "Full Name / Display Name",
      "Role",
      "Package Type",
      "Email or Phone",
      "Level",
      "Total XP",
      "Day Streak",
      "Status",
    ],
  ];

  const moodHeaders = [
    [
      "Date",
      "User Name",
      "Mood Rating",
      "Stress (1-10)",
      "Sleep (hrs)",
      "Exercise (mins)",
      "Gratitude Note",
      "Journal Entry",
      "AI Counselor Feedback",
    ],
  ];

  const certHeaders = [
    [
      "Issued At",
      "User Name",
      "Certificate Title (EN)",
      "Certificate Title (TH)",
      "Certificate ID",
      "Digital Signature",
    ],
  ];

  await updateSheetRange(spreadsheetId, "Users!A1:I1", userHeaders, token);
  await updateSheetRange(spreadsheetId, "MoodLogs!A1:I1", moodHeaders, token);
  await updateSheetRange(spreadsheetId, "Certificates!A1:F1", certHeaders, token);
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
    throw new Error(`ไม่อนุญาต: เฉพาะบัญชี ${AUTHORIZED_SHEETS_EMAIL} เท่านั้นที่มีสิทธิ์ซิงค์ข้อมูล Google Sheets`);
  }

  const targetId = spreadsheetId || getSavedSpreadsheetId();
  if (!targetId) {
    throw new Error("No Google Spreadsheet configured. Please create or link one first.");
  }

  const token = await getAccessToken();
  if (!token) {
    throw new Error("No Google access token found. Please sign in with Google.");
  }

  const rows = users.map((u) => [
    u.lastVisitDate || new Date().toISOString(),
    u.name,
    u.role,
    u.packageType || "basic",
    u.emailOrPhone || "-",
    u.level,
    u.xp,
    u.streak,
    u.isRegistered ? "Registered" : "Guest",
  ]);

  await initializeSheetHeaders(targetId, token);

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${targetId}/values/Users!A2:I1000:clear`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (rows.length > 0) {
    await updateSheetRange(targetId, `Users!A2:I${rows.length + 1}`, rows, token);
  }

  const now = new Date().toLocaleString("th-TH");
  localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);

  return {
    count: rows.length,
    spreadsheetUrl: getSpreadsheetUrl(targetId),
  };
};

/**
 * Syncs mood logs to the MoodLogs sheet
 */
export const syncMoodLogsToSheet = async (
  logs: MoodCheckIn[],
  userName: string,
  spreadsheetId?: string
): Promise<{ count: number }> => {
  if (!auth.currentUser || !isAuthorizedSheetsEmail(auth.currentUser.email)) {
    throw new Error(`ไม่อนุญาต: เฉพาะบัญชี ${AUTHORIZED_SHEETS_EMAIL} เท่านั้นที่มีสิทธิ์ซิงค์ข้อมูล Google Sheets`);
  }

  const targetId = spreadsheetId || getSavedSpreadsheetId();
  if (!targetId) {
    throw new Error("No Google Spreadsheet configured.");
  }

  const token = await getAccessToken();
  if (!token) {
    throw new Error("No Google access token found.");
  }

  const rows = logs.map((log) => [
    log.date,
    userName,
    log.mood,
    log.stress,
    log.sleep,
    log.exercise,
    log.gratitude || "-",
    log.journal || "-",
    log.aiAnalysis || "-",
  ]);

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${targetId}/values/MoodLogs!A2:I1000:clear`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (rows.length > 0) {
    await updateSheetRange(targetId, `MoodLogs!A2:I${rows.length + 1}`, rows, token);
  }

  return { count: rows.length };
};

/**
 * Appends a single newly registered user to the spreadsheet in real time
 */
export const appendSingleUserToSheet = async (user: UserProfile) => {
  const targetId = getSavedSpreadsheetId();
  if (!targetId) return;

  const token = await getAccessToken();
  if (!token) return;

  const row = [
    new Date().toISOString(),
    user.name,
    user.role,
    user.packageType || "basic",
    user.emailOrPhone || "-",
    user.level,
    user.xp,
    user.streak,
    "Registered",
  ];

  try {
    await appendSheetRows(targetId, "Users!A:I", [row], token);
  } catch (err) {
    console.error("Auto-sync single user to Google Sheets failed:", err);
  }
};

/**
 * Appends a single mood check-in to the spreadsheet in real time
 */
export const appendSingleMoodLogToSheet = async (log: MoodCheckIn, userName: string) => {
  const targetId = getSavedSpreadsheetId();
  if (!targetId) return;

  const token = await getAccessToken();
  if (!token) return;

  const row = [
    log.date,
    userName,
    log.mood,
    log.stress,
    log.sleep,
    log.exercise,
    log.gratitude || "-",
    log.journal || "-",
    log.aiAnalysis || "-",
  ];

  try {
    await appendSheetRows(targetId, "MoodLogs!A:I", [row], token);
  } catch (err) {
    console.error("Auto-sync mood log to Google Sheets failed:", err);
  }
};
