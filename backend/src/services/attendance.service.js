import { query } from "../config/db.js";

export const isAdminExists = async (adminId) => {
  const isExists = await query(
    `SELECT public_id FROM admins
    WHERE public_id = $1`,
    [adminId]
  );

  if (isExists.rows.length === 0) {
    return 'Admin account not found.';
  }
}

export const isInternExists = async (internId) => {
  const isExists = await query(
    `SELECT public_id FROM interns
    WHERE public_id = $1`,
    [internId]
  );

  if (isExists.rows.length === 0) {
    return 'No intern found.';
  }
}

export const validateAttendanceRequest = async (internId, file) => {
  if (!internId) {
    return 'Select an intern to proceed.';
  }

  if (!file) {
    return 'Attendance photo is required.';
  }

  const isInternExists = await query(
    `SELECT intern_id FROM interns
    WHERE intern_id = $1`,
    [internId]
  );

  if (isInternExists.rows.length === 0) {
    return 'No intern found.';
  }
}