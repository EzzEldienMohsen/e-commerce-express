const pool = require('../db');
const { hashUserPassword, verifyPassword } = require('../utils/hash');
const { generateToken, verifyToken } = require('../utils/jwtUtils');

const signUp = async (req, res) => {
  const { f_name, l_name, email, phone, password } = req.body;
  try {
    const hashedPassword = hashUserPassword(password);
    const insertingResult = await pool.query(
      `
    INSERT INTO clientUser (f_name,l_name,email,phone,password) VALUES ($1,$2,$3,$4,$5) RETURNING id
    `,
      [f_name, l_name, email, phone, hashedPassword]
    );
    const id = insertingResult.rows[0].id;
    const token = generateToken(id);
    const result = await pool.query(
      `UPDATE clientUser SET token =$2 WHERE id =$1 RETURNING token`,
      [id, token]
    );
    res.cookie('auth_token', token, {
      httpOnly: true, // Not accessible via JavaScript on the client-side
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 60 * 60 * 24,
      sameSite: 'lax', // Adjust based on your requirements ('strict', 'lax', or 'none')
    });
    const {
      f_name: firstName,
      l_name: lastName,
      email: registeredEmail,
      token: updatedToken,
    } = result.rows[0];
    res.status(201).json({
      success: true,
      user: { firstName, lastName, registeredEmail, updatedToken },
      message: 'Signed up successfully',
    });
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loggingResult = await pool.query(
      `
        SELECT * FROM clientUser WHERE email =$1`,
      [email]
    );
    const user = loggingResult.rows[0];
    if (loggingResult.rowCount === 0) {
      res.status(400).json({
        success: false,
        message: 'The email is not registered to an account',
      });
    }
    if (!verifyPassword(user.password, password)) {
      res.status(400).json({
        success: false,
        message: 'Please check password and try again',
      });
    }
    const token = generateToken(user.id);
    const result = await pool.query(
      `UPDATE clientUser SET token =$1 WHERE id= $2 RETURNING *`,
      [token, user.id]
    );

    res.cookie('auth_token', token, {
      httpOnly: true, // Not accessible via JavaScript on the client-side
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 60 * 60 * 24,
      sameSite: 'lax', // Adjust based on your requirements ('strict', 'lax', or 'none')
    });
    const {
      f_name: firstName,
      l_name: lastName,
      email: registeredEmail,
      token: updatedToken,
    } = result.rows[0];
    res.status(201).json({
      success: true,
      user: { firstName, lastName, registeredEmail, updatedToken },
      message: 'Signed up successfully',
    });
  } catch (error) {
    console.error('Error during logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    const { userId } = req.userId;
    const result = await pool.query(
      `UPDATE clientUser SET token =$2 WHERE id = $1`,
      [userId, ' ']
    );
    res.cookie('auth_token', ' ', {
      httpOnly: true, // Not accessible via JavaScript on the client-side
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 60 * 60 * 24,
      sameSite: 'lax', // Adjust based on your requirements ('strict', 'lax', or 'none')
    });
    return res
      .status(202)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logging out ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

module.exports = { signUp, login, logOutUser };
