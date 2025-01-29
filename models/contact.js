const pool = require('../db');

const sendMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    await pool.query(
      `
        INSERT INTO contact (name,email,phone,message) VALUES ($1,$2,$3,$4)
        `,
      [name, email, phone, message]
    );
    res
      .status(201)
      .json({ success: true, message: 'message sent successfully' });
  } catch (error) {
    console.error('error sending the message', error);
    res.status(500).json({
      success: false,
      message: 'could not send the message please try again later',
    });
  }
};

module.exports = sendMessage;
