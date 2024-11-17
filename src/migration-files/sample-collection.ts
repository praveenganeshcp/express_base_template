import { Db } from "mongodb";

module.exports = {
    async up(db: Db) {
      await db.collection('employees').insertMany([
        { name: "John", designation: "SDE" },
        { name: 'Doe', designation: "QA" },
      ]);
    },
  
    async down(db: Db) {
      await db.collection('cars').deleteMany({});
    },
};