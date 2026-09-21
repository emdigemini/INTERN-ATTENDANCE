import { query } from "../config/db.js";
import { validateAttendanceRequest } from "../services/attendance.service.js";
import cloudinary from "../middleware/cloudinary.middleware.js";

export const getAttendanceData = async (req, res) => {
  try {
    const { internId, startDate, endDate } = req.query;
    if (!startDate) {
      return res.status(400).json({ message: 'Start date is required.' });
    }

    if (!endDate) {
      return res.status(400).json({ message: 'End date is required.' });
    }

    const results = await query(
      `
        SELECT
          a.intern_id,
          i.first_name,
          i.last_name,
          i.completed_hours,
          i.required_hours,
          a.time_in,
          a.time_out
        FROM attendance a
        JOIN interns i
          ON a.intern_id = i.intern_id
        WHERE a.intern_id = $1 
          AND a.time_in >= $2::date
          AND a.time_in < ($3::date + INTERVAL '1 day')
      `,
      [internId, startDate, endDate]
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'No attendance data for the selected intern.' });
    }
    const attendanceData = results.rows;
    res.status(200).json({ attendanceData });
  } catch (err) {
    console.log('Error in getAttendanceData controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const internStats = async (req, res) => {
  try {
    const internId = req.query.id;

    const result = await query(
      `SELECT
        intern_id, first_name, last_name,
        required_hours, completed_hours
      FROM interns
      WHERE intern_id = $1`,
      [internId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No attendance statistics found for the selected intern.' });
    }

    const intern = result.rows[0];

    res.status(200).json({ intern });
  } catch (err) {
    console.log('Error in internStats controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const checkAttendanceStatus = async (req, res) => {
  try {
    const internId = req.query.id;
    const result = await query(
      `SELECT
        intern_id
      FROM interns
      WHERE intern_id = $1`,
      [internId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No intern found.' });
    }

    const attendanceRes = await query(
      `SELECT
        CASE
          WHEN time_in IS NULL THEN 'time_in'
          WHEN time_out IS NULL THEN 'time_out'
          ELSE 'time_in'
        END AS status
      FROM attendance
      WHERE intern_id = $1
      ORDER BY id DESC
      LIMIT 1`,
      [internId]
    );

    const status = attendanceRes.rows[0]?.status ?? "time_in";

    res.status(200).json({ status });
  } catch (err) {
    console.log('Error in checkAttendanceStatus controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const timeIn = async (req, res) => {
  try {
    const { internId } = req.body;
    const file = req.file
    const filename = `TIME_IN-${file.originalname}`;

    const validateError = await validateAttendanceRequest(internId, file);
    if (validateError) {
      return res.status(404).json({ message: validateError });
    }

    const activeAttendance = await query(
      `SELECT id
      FROM attendance
      WHERE intern_id = $1
        AND time_in IS NOT NULL
        AND time_out IS NULL`,
      [internId]
    );

    if (activeAttendance.rows.length > 0) {
      return res.status(400).json({
        message: 'This intern has already timed in.'
      });
    }

    const result = await uploadToCloudinary(
      file.buffer,
      filename,
      "cnx intern attendance"
    );

    const imageUrl = result.secure_url;

    const attendance = await query(
      `INSERT INTO attendance
      (intern_id, time_in, time_in_url)
      VALUES ($1, NOW(), $2)
      RETURNING *`,
      [internId, imageUrl]
    );

    if (attendance.rows.length === 0) {
      return res.status(400).json({ message: 'Failed to time-in.' });
    }

    const results = await query(
      `SELECT 
        a.intern_id,
        i.first_name,
        i.last_name
      FROM attendance a
      JOIN interns i ON i.intern_id = a.intern_id
      WHERE a.id = $1`,
      [attendance.rows[0].id]
    );

    if (results.rows.length === 0) {
      return res.status(404).json({
        message: 'Attendance record not found.'
      });
    }

    const internName = `${results.rows[0].first_name} ${results.rows[0].last_name}`

    res.status(200).json({ message: `${internName} has successfully timed-in.` });
  } catch (err) {
    console.log('Error in timeIn controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const timeOut = async (req, res) => {
  try {
    const { internId } = req.body;
    const file = req.file
    const filename = `TIME_OUT-${file.originalname}`;

    const validateError = await validateAttendanceRequest(internId, file);
    if (validateError) {
      return res.status(404).json({ message: validateError });
    }

    const result = await uploadToCloudinary(
      file.buffer,
      filename,
      "cnx intern attendance"
    );

    const imageUrl = result.secure_url;

    const attendance = await query(
      `UPDATE attendance
      SET 
        time_out = NOW(),
        time_out_url = $2
      WHERE intern_id = $1
        AND time_in IS NOT NULL
        AND time_out IS NULL
      RETURNING *,
        ROUND(
          LEAST(
            FLOOR(EXTRACT(EPOCH FROM (time_out - time_in)) / 60) / 60.0,
            8
          )::numeric,
          2
        ) AS consumed_hours`,
      [internId, imageUrl]
    );

    if (attendance.rows.length === 0) {
      return res.status(400).json({ message: 'Failed to time-out, no active time-in found.' });
    }

    const consumedHours = Number(attendance.rows[0].consumed_hours);
    const updateRes = await query(
      `UPDATE interns
      SET completed_hours = completed_hours + $1
      WHERE intern_id = $2
      RETURNING first_name, last_name`,
      [consumedHours, internId]
    );

    const internName = `${updateRes.rows[0].first_name} ${updateRes.rows[0].last_name}`

    res.status(200).json({ message: `${internName} has successfully timed out. ${consumedHours} hours completed.` });
  } catch (err) {
    console.log('Error in timeOut controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const uploadToCloudinary = (buffer, filename, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};
