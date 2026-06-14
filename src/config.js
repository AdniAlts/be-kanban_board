export const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
export const HOST = process.env.HOST ?? '127.0.0.1';
export const DATABASE_PATH = process.env.DATABASE_PATH ?? 'data/kanban.sqlite';
