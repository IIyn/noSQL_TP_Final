import { openDatabase } from "./database.js";

// nom de la database que l'on souhaite utiliser
const DB_NAME = "ny";

openDatabase(DB_NAME).then(db => {
  total(db).then(console.log)
  totalGRadeAD(db).then(console.log)
});

async function total(db) {

  // accès à la collection restaurants
  const restaurants = await db.collection("restaurants");

  // aggregation pipeline
  const res = await restaurants
    .aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 }, // total des documents
        },
      },
    ])
    .toArray();

  return res; // retourne le total des documents
}

async function totalGRadeAD(db) {
  // accès à la collection restaurants
  const restaurants = await db.collection("restaurants");

  // aggregation pipeline
  const res = await restaurants
    .aggregate([
      { $match: { borough_id: "Brooklyn" } },
      { $unwind: "$grades" },
      {
        $group: {
          _id: { name: "$name" },
          countA: { $sum: { $cond: [{ $eq: ["$grades.grade", "A"] }, 1, 0] } }, // somme des A
          countD: { $sum: { $cond: [{ $eq: ["$grades.grade", "D"] }, 1, 0] } }, // somme des D
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          countA: 1,
          countD: 1,
        },
      },
    ])
    .toArray();

  return res; // retourne tous les documents dans brooklyn avec le nombre de A et D
}
