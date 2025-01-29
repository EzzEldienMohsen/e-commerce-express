const { products } = require('./products');
const pool = require('./db');

const insertInitialToDB = async () => {
  try {
    // Use Promise.all for concurrent inserts
    await Promise.all(
      products.map(async (prod) => {
        const { id, img, name, type, price, cat } = prod;
        await pool.query(
          'INSERT INTO products (id, img, name, type, price, cat) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, img, name, type, price, cat]
        );
      })
    );
    console.log('All products inserted successfully.');
  } catch (error) {
    console.error('Error inserting products:', error.message);
  }
};
insertInitialToDB();
