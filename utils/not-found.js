const notFound = (req, res) => res.status(404).send('Resources are not found');

module.exports = notFound;
