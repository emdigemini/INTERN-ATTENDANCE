import { query } from '../config/db.js';

export const getAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id; 
    const result = await query(
      `SELECT 
        public_id, name, 
        username, role,
        company_site 
      FROM admins
      WHERE public_id = $1`,
      [adminId]
    );

    if (result.rows.length === 0)
      return res.status(401).end();

    const admin = result.rows[0];

    res.status(200).json({ admin });
  } catch (err) {
    console.log('Error in getAdmin controller: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
} 