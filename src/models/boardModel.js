export function getSeedSummary(db) {
  return {
    boards: db.prepare('SELECT COUNT(*) AS total FROM boards').get().total,
    columns: db.prepare('SELECT COUNT(*) AS total FROM columns').get().total,
  };
}
