import { HOST, PORT } from './config.js';
import { createApp } from './app.js';
import { createDatabase } from './db.js';

const db = createDatabase();
const app = createApp(db);

const server = app.listen(PORT, HOST, () => {
  console.log(`Kanban Board API running at http://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
});
