import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cpfRoutes from './routes/cpfRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', cpfRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
