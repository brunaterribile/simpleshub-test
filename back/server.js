const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/cpfRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
