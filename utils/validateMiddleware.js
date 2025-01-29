const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next(); // If validation passes, continue to the next middleware
  } catch (error) {
    return res.status(400).json({ success: false, error: error.errors });
  }
};

module.exports = validate;
