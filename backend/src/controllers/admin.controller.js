import { query } from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createAdmin = async  (req, res) => {
  try { 
    const { name, username, email, role, password, confirmPassword } = req.body;

    if (!name || !username || !email || !role || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords are not match.' });
    }

    const usernameExists = await query(
      `SELECT email FROM admins
      WHERE username = $1`,
      [username]
    );

    if (usernameExists.rows.length > 0) {
      return res.status(400).json({ message: 'This admin already exists.' })
    }

    const emailExists = await query(
      `SELECT email FROM admins
      WHERE email = $1`,
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'This email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const results = await query(
      `INSERT INTO admins
      (name, username, email, password, role, company_site)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING username`,
      [name, username, email, hashedPassword, role, 'exxa']
    );

    const usernameAdmin = results.rows[0].username;

    return res.status(201).json({ message: `${role === 'admin' ? 'Admin' : 'Super Admin'} has been created for ${usernameAdmin}` });
  } catch (err) {
    console.log('Error in createSuperAdmin controller: ', err);
    if (err.code === '23514') {
      if (err.constraint === 'admins_email_check') {
        return res.status(400).json({ message: 'Please enter a valid email address.' })
      }
    }

    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password)

    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const isUserExists = await query(
      `SELECT public_id, username, role, password 
      FROM admins
      WHERE username = $1`,
      [username]
    );

    if (isUserExists.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid username or password.' })
    }

    const admin = isUserExists.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Error, invalid password.' });
    }

    const security_id = jwt.sign(
      { id: admin.public_id },
      process.env.JWT_SECRET_SUPER,
      { expiresIn: '7d' }
    );

    res.cookie('security_id', security_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'
        ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ 
      admin: {
        public_id: admin.public_id,
        username: admin.username,
        role: admin.role
      }
    })
  } catch (err) {
    onsole.log('Error in loginAdmin controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const isAdminLogin = await query(
      `SELECT 
        public_id, name, 
        username, role,
        company_site 
      FROM admins
      WHERE public_id = $1`,
      [adminId]
    );

    if (isAdminLogin.rows.length === 0) {
      return res.status(401).json({
        message: 'Admin session is already logged out.'
      });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production'
        ? 'none'
        : 'lax',
      path: '/'
    };

    res.clearCookie('security_id', cookieOptions);

    res.status(200).json({ message: 'Logged out.' });
  } catch (err) {
    console.log('Error in logoutAdmin controller', err);
    res.status(500).json({ message: 'Internal server error.' })
  }
} 

export const addNewInterns = async (req, res) => {
  try {
    const { firstName, lastName, schoolName, requiredHours, companySite, passwordConfirmation } = req.body;
    const adminId = req.admin.id;

    const isAdminLogin = await query(
      `SELECT 
        public_id, name, 
        username, role,
        company_site, password 
      FROM admins
      WHERE public_id = $1`,
      [adminId]
    );

    if (isAdminLogin.rows.length === 0) {
      return res.status(401).json({
        message: 'Admin session is invalid or has expired.'
      });
    }

    const isMatch = await bcrypt.compare(passwordConfirmation, isAdminLogin.rows[0].password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Error, invalid password.' });
    }

    const admin = isAdminLogin.rows[0];

    if (admin.company_site.toLowerCase() !== companySite.toLowerCase()) {
      return res.status(403).json({
        message: 'Your admin account is not authorized for this company site.'
      });
    }

    if (!firstName || !lastName || !schoolName || !requiredHours || !companySite) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const isInternExists = await query(
      `SELECT first_name, last_name, company_site FROM interns
      WHERE first_name = $1
      AND last_name = $2`,
      [firstName, lastName]
    );
    
    if (isInternExists.rows.length > 0) {
      const fullName = 
        isInternExists.rows[0].first_name + ' ' + isInternExists.rows[0].last_name; 
      const site = isInternExists.rows[0].company_site;

      return res.status(400).json({
        message: `${fullName} is already registered as an intern at ${site.toUpperCase()}.`
      });
    }

    const newIntern = await query(
      `INSERT INTO interns
      (first_name, last_name, school_name, required_hours, company_site)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        intern_id, first_name,
        last_name, school_name, 
        required_hours, completed_hours,
        started_at, company_site`,
      [firstName, lastName, schoolName, requiredHours, companySite]
    );

    const fullName = newIntern.rows[0].first_name + ' ' + newIntern.rows[0].last_name

    return res.status(201).json({
      message: `${fullName} has been successfully registered as an intern at ${companySite.toUpperCase()}.`,
    });
  } catch (err) {
    console.log('Error in addNewInterns controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const editIntern = async (req, res) => {
  try {
    const { firstName, lastName, schoolName, requiredHours, startedAt, passwordConfirmation } = req.body;
    const { id: internId } = req.query;
    const adminId = req.admin.id;

    const isAdminLogin = await query(
      `SELECT 
        public_id, name, 
        username, role,
        company_site, password 
      FROM admins
      WHERE public_id = $1`,
      [adminId]
    );

    if (isAdminLogin.rows.length === 0) {
      return res.status(401).json({
        message: 'Admin session is invalid or has expired.'
      });
    }

    const isMatch = await bcrypt.compare(passwordConfirmation, isAdminLogin.rows[0].password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Error, invalid password.' });
    }


    const isInternExists = await query(
      `SELECT first_name, last_name, company_site FROM interns
      WHERE intern_id = $1`,
      [internId]
    );
    
    if (isInternExists.rows.length === 0) {
      return res.status(404).json({
        message: 'Intern not found.'
      });
    }

    await query(
      `
        UPDATE interns
        SET
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          school_name = COALESCE($3, school_name),
          required_hours = COALESCE($4, required_hours),
          started_at = COALESCE($5, started_at)
        WHERE intern_id = $6
      `,
      [
        firstName ?? null,
        lastName ?? null,
        schoolName ?? null,
        requiredHours ?? null,
        startedAt ?? null,
        internId
      ]
    );

    res.status(200).json({ message: 'Intern updated successfully.' });
  } catch (err) {
    console.log('Error in editIntern controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
} 

export const fetchAllInterns = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 25;
    const offset = (page-1) * limit;
    const adminId = req.admin.id;

    const adminRes = await query(
      `SELECT public_id, role, company_site
      FROM admins
      WHERE public_id = $1`,
      [adminId]
    );
    
    const admin = adminRes.rows[0];
    let companySite;

    if (admin.role === 'admin') {
      companySite = admin.company_site;
    } else if (admin.role === 'super_admin') {
      companySite = req.query.companySite;
    }

    const results = await query(
      `SELECT 
        intern_id, first_name, 
        last_name, school_name,
        required_hours, completed_hours,
        company_site, started_at
      FROM interns
      WHERE company_site = $1
      ORDER BY completed_hours DESC, started_at DESC
      LIMIT $2 OFFSET $3`,
      [companySite, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) 
      FROM interns
      WHERE company_site = $1`,
      [companySite]
    );

    const totalItems = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    const interns = results.rows;

    res.status(200).json({
      res: {
        interns,
        pagination: {
          page, limit, 
          offset, totalItems,
          totalPages
        }
      }
    });
  } catch (err) {
    console.log('Error in fetchAllInterns controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const fetchUnfinishedInterns = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const adminRes = await query(
      `SELECT public_id, role, company_site
      FROM admins
      WHERE public_id = $1`,
      [adminId]
    );
    
    const admin = adminRes.rows[0];
    const companySite = admin.company_site; 

    const results = await query(
      `SELECT 
        intern_id, first_name, 
        last_name, school_name,
        required_hours, completed_hours,
        company_site, started_at
      FROM interns
      WHERE company_site = $1
        AND completed_hours < required_hours
      ORDER BY started_at DESC`,
      [companySite]
    );

    const interns = results.rows;

    res.status(200).json({ interns });
  } catch (err) {
    console.log('Error in fetchAllInterns controller: ', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}