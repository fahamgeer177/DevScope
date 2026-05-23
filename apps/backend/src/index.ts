import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';

import * as authCtrl from './controllers/auth.controller.js';
import * as githubCtrl from './controllers/github.controller.js';
import * as searchCtrl from './controllers/search.controller.js';
import { requireAuth, optionalAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();

// Auth
apiRouter.post('/auth/register', authCtrl.register);
apiRouter.post('/auth/login', authCtrl.login);
apiRouter.post('/auth/logout', authCtrl.logout); // wait, logout wasn't checking requireAuth in earlier snippet, lets skip requireAuth for now
apiRouter.get('/auth/me', requireAuth, authCtrl.me);

// Github
apiRouter.get('/github/profile/:username', optionalAuth, githubCtrl.getProfile);
if (githubCtrl.getRepos) {
    apiRouter.get('/github/repos/:username', optionalAuth, githubCtrl.getRepos);
}

// Search
apiRouter.get('/search/history', requireAuth, searchCtrl.getHistory);
apiRouter.delete('/search/history/:id', requireAuth, searchCtrl.deleteHistoryItem);
apiRouter.delete('/search/history', requireAuth, searchCtrl.clearHistory);

// Map /api or /api/v1 (frontend lib uses the base URL configured in .env, so /api is fine)
// api.ts uses \/path\ so it appends to API_BASE which is /api.
app.use('/api/v1', apiRouter); // just in case
app.use('/api', apiRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = config.PORT || 3002;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
