const crypto = require('node:crypto');
const hashUserPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return `${hashedPassword.toString('hex')}:${salt}`;
};
const verifyPassword = (storedPassword, suppliedPassword) => {
  const parts = storedPassword.split(':');
  if (parts.length !== 2) {
    throw new Error(
      'Invalid stored password format. Expected "hashedPassword:salt".'
    );
  }

  const [hashedPassword, salt] = parts;
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');

  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
};

module.exports = { hashUserPassword, verifyPassword };
