const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "db.json");

const emptyDb = () => ({
  users: [],
  modules: [],
  sprints: [],
  dailyUpdates: [],
  auditLogs: [],
  config: {},
});

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = emptyDb();
    persist(initial);
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function persist(db) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

let cache = load();

function getDb() {
  return cache;
}

function saveDb(mutator) {
  const next = mutator(cache) || cache;
  cache = next;
  persist(cache);
  return cache;
}

function reloadDb() {
  cache = load();
  return cache;
}

function resetDb(data) {
  cache = data;
  persist(cache);
  return cache;
}

module.exports = { getDb, saveDb, reloadDb, resetDb, DATA_FILE };
