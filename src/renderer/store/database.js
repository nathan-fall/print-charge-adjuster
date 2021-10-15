import Dexie from "dexie";

const db = new Dexie("PrintChargeAdjusterDatabase");
db.version(1).stores({
  printjobs: "++id, date, studentId, size, paperType, collected, &serialNumber", // name, count
  members: "++id, studentId", // name
});

export default db;
