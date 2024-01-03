import express from 'express';
//import { Request, Response, }from 'express';
import logger from '../logger';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './router';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

/**Point to router.ts file */
app.use('/', router);

/**Get API for express with typescript */
// app.get('/', ( req: Request, res: Response) => {
//   res.send('Hello, Welcom to Express with TypeScript!');
// });

/** server listening port*/
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  logger.writeLog("i",`Server is running on http://localhost:${PORT}`, '');
});

export default app;