const pool = require('../db');
const getAddresses = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `SELECT * FROM client_address WHERE client_id = $1`,
      [userId]
    );
    res.status(200).json({
      success: true,
      totalAddresses: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error('getting addressError', error);
    res.status(500).json({
      success: false,
      message: 'could not get addresses try again later',
    });
  }
};

const createAddress = async (req, res) => {
  const { address_name, address_details } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'INSERT INTO client_address (address_name,address_details,client_id) VALUES ($1,$2,$3) Returning *',
      [address_name, address_details, userId]
    );
    res.status(201).json({
      success: true,
      message: 'Address created successfully.',
      data: result.rows,
    });
  } catch (error) {
    console.error('failed adding address', error);
    res.status(500).json({
      success: false,
      message: 'Failed adding address, try again later',
    });
  }
};

const getAddressById = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const result = await pool.query(
      `
        SELECT * FROM client_address WHERE client_id = $1 AND id = $2
        `,
      [userId, id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('fetching address error ', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed Fetching address' });
  }
};

const updateAddress = async (req, res) => {
  const { address_name, address_details } = req.body;
  const { id } = req.params;
  const userId = req.userId;
  try {
    const result = await pool.query(
      'UPDATE client_address SET address_name = $1, address_details =$2 WHERE client_id = $3 AND id = $4 RETURNING *',
      [address_name, address_details, userId, id]
    );
    res.status(201).json({
      success: true,
      data: result.rows,
      message: 'Address updated successfully',
    });
  } catch (error) {
    console.error('update address error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address, try again later',
    });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  console.log('this is user id', userId);
  console.log('this is req', req);
  try {
    const result = await pool.query(
      `
        DELETE FROM  client_address WHERE id =$1 AND client_id =$2
        `,
      [id, userId]
    );
    res
      .status(202)
      .json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('error deleting address', error);
    res.status(500).json({
      success: false,
      message: 'Failed deleting address,try again later',
    });
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
