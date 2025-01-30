const pool = require('../db');

const getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `
        SELECT * FROM clientUser WHERE id = $1
        `,
      [userId]
    );
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('fetching profile', error);
    res.status(500).json({
      success: false,
      data: {},
      message: 'Failed fetching profile please try again later',
    });
  }
};

const updateProfile = async (req, res) => {
  const {
    f_name,
    l_name,
    email,
    phone,
    main_address,
    gender,
    date_of_birth,
    nationality,
    avatar_url,
    bio,
  } = req.body;
  const userId = req.userId;
  try {
    const result = await pool.query(
      `
    UPDATE clientUser SET f_name = $2, l_name = $3, email = $4, phone = $5,
    main_address = $6, gender = $7, date_of_birth = $8,  nationality = $9,
    avatar_url = $10, bio = $11 WHERE id = $1 RETURNING *
    `,
      [
        userId,
        f_name,
        l_name,
        email,
        phone,
        main_address || null,
        gender || null,
        date_of_birth || null,
        nationality || null,
        avatar_url || null,
        bio || null,
      ]
    );
    res.status(202).json({
      success: true,
      data: result.rows,
      message: 'profile updated successfully',
    });
  } catch (error) {
    console.error('error updating address', error);
    res.status(500).json({
      success: false,
      data: {},
      message: 'Failed to update profile, please try again later',
    });
  }
};

const deleteProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `
        DELETE FROM clientUser WHERE id =$1
        `,
      [userId]
    );
    res
      .status(202)
      .json({ success: true, message: 'profile deleted successfully' });
  } catch (error) {
    console.error('error deleting profile', error);
    res.status(500).json({
      success: false,
      message: 'failed deleting profile, please try again later',
    });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile };
