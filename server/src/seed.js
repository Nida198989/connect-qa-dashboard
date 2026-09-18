const bcrypt = require("bcryptjs");
const { resetDb } = require("./db");
const { DEFAULT_CONFIG } = require("./constants");

const passwordHash = bcrypt.hashSync("Connect@123", 10);

function buildUsers() {
  return [
    { id: "user-admin", name: "System Admin", email: "admin@connect.qa", role: "admin", active: true, passwordHash },
    { id: "user-lead", name: "Nida Naaz", email: "nida.naaz@connect.qa", role: "lead", active: true, passwordHash },
  ];
}

function seed() {
  const data = {
    users: buildUsers(),
    modules: [],
    sprints: [],
    dailyUpdates: [],
    auditLogs: [],
    config: { ...DEFAULT_CONFIG },
  };
  resetDb(data);
  return data;
}

if (require.main === module) {
  seed();
  console.log("Reset Connect QA dashboard to an empty team-owned data set.");
}

module.exports = { seed, buildUsers };
