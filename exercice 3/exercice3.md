# Exercice 3 Recherche & Développement - Collection Restaurants

Avec ces nouvelles notions, quelles améliorations pourrions nous apporter à la collection restaurants utilisée précédemment ?

## Proposez une série de modifications structurelles de la base de données "ny". À faire en groupe.

- une collection cuisine contenant les catégories de cuisines (fast-food, pizzeria, restaurant, etc.)

- une collection borough

On associe ensuite chaque restaurant avec l'id de son borough et l'id de sa catégorie.

## Implémenter ces modifications.

```js
// create collection borough
db.createCollection("borough");

db.borough.insertMany([
  { _id: "Manhattan", name: "Manhattan" },
  { _id: "Brooklyn", name: "Brooklyn" },
  { _id: "Bronx", name: "Bronx" },
  { _id: "Queens", name: "Queens" },
  { _id: "Staten Island", name: "Staten Island" },
  { _id: "Missing", name: "Missing"}
]);

const boroughs = db.borough.find().toArray();

for (borough of boroughs) {
  db.restaurants.updateMany(
    { borough: borough._id },
    { $set: { borough_id: borough._id } }
  );
}

// unset borough
db.restaurants.updateMany({}, { $unset: { borough: "" } });

db.restaurants.find({ borough_id: { $exists : true} }).count();

// find all restaurants in brooklyn
db.restaurants.find({
  borough_id: db.borough.findOne({ name: "Brooklyn" })._id,
});
```

```js
// create collection cuisine
db.createCollection("cuisine");

// get all cuisines in restaurants and insert them in cuisine collection
db.restaurants.distinct("cuisine").forEach((cuisine) => {
  db.cuisine.insertOne({ _id: cuisine, name: cuisine });
});

const cuisines = db.cuisine.find().toArray();

for (cuisine of cuisines) {
  db.restaurants.updateMany(
    { cuisine: cuisine._id },
    { $set: { cuisine_id: cuisine._id } }
  );
}

// find all restaurants with cuisine_id
db.restaurants.find({ cuisine_id: { $exists: true } });

// unset cuisine
db.restaurants.updateMany({}, { $unset: { cuisine: "" } });
```