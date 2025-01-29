// requiring packages
const express = require('express');
require('cookie-parser');
// importing routes
const productsRouter = require('./api/v1/products/productsRouter');
const signUpRouter = require('./api/v1/sign-up/signUpRouter');
const loginRouter = require('./api/v1/login/loginRouter');
const logOutRoute = require('./api/v1/log-out/logOutRoute');
// starting project
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
// using routes
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/sign-up', signUpRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/log-out', logOutRoute);

app.listen(port, () => console.log(`server is on port ${port}`));
