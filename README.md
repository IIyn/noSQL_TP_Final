# Exercice 1

- Créer la base de données bookstore et les collections categories et books :

```js
// Créer la base de données bookstore
use bookstore

// Créer la collection categories et insérer les documents
db.categories.insertMany([
  { name: "Programmation" },
  { name: "SQL" },
  { name: "NoSQL" }
])

// Créer la collection books et insérer les documents
db.books.insertMany([
  { title: "Python" },
  { title: "JS" },
  { title: "PosgreSQL" },
  { title: "MySQL" },
  { title: "MongoDB" }
])
```

- Faites un script JS afin d'associer chaque livre à sa catégorie en utilisant l'id de sa catégorie. Créez une propriété category_id dans la collection books.

```js
// only get id of category
const categories = db.categories.find({}, { _id: 1 }).toArray(); // [ObjectId(), ObjectId(), ObjectId()]

// get id of category and insert it in books
db.books.updateOne(
  { title: "Python" },
  { $set: { category_id: categories[0]._id } }
);

db.books.updateOne(
  { title: "JS" },
  { $set: { category_id: categories[0]._id } }
);

db.books.updateOne(
  { title: "PosgreSQL" },
  { $set: { category_id: categories[1]._id } }
);

db.books.updateOne(
  { title: "MySQL" },
  { $set: { category_id: categories[1]._id } }
);

db.books.updateOne(
  { title: "MongoDB" },
  { $set: { category_id: categories[2]._id } }
);
```

- Puis faites une requête pour récupérer les livres dans la catégorie programmation.

```js
// get all books in category "Programmation"
db.books.find({
  category_id: db.categories.findOne({ name: "Programmation" })._id,
});
```

- Combien de livres dans noSQL ?

```js
db.books
  .find({ category_id: db.categories.findOne({ name: "NoSQL" })._id })
  .count();
```

- Associez maintenant les livres ci-dessous aux catégories :

```js
const newBooks = [
  { title: "Python & SQL" }, // programmation & SQL
  { title: "JS SQL ou NoSQL" }, // programmation
  { title: "Pandas & SQL & NoSQL" }, // SQL, NoSQL et programmation
  { title: "Modélisation des données" }, // aucune catégorie
];
```

```js
// insert newBooks

db.books.insertMany(newBooks);

// get id of category and insert it in books
db.books.updateOne(
  { title: "Python & SQL" },
  { $set: { category_id: [categories[0]._id, categories[1]._id] } }
);

db.books.updateOne(
  { title: "JS SQL ou NoSQL" },
  { $set: { category_id: [categories[0]._id] } }
);

db.books.updateOne(
  { title: "Pandas & SQL & NoSQL" },
  {
    $set: {
      category_id: [categories[0]._id, categories[1]._id, categories[2]._id],
    },
  }
);

db.books.updateOne(
  { title: "Modélisation des données" },
  { $unset: { category_id: "" } }
);
```

- Récupérez tous les livres qui n'ont pas de catégorie

```js
db.books.find({ category_id: { $exists: false } });
```

# Exercice 2

Dans la base de données bookstore.

Créez la collection categoriestree contenant les documents suivants :

```js
db.categoriestree.insertMany([
  { _id: "Books", parent: null, name: "Informatique" },
  {
    _id: "Programming",
    parent: "Books",
    books: [
      "Python apprendre",
      "Pandas & Python",
      "async/await JS & Python",
      "JS paradigme objet",
      "Anaconda",
    ],
  },
  {
    _id: "Database",
    parent: "Programming",
    books: ["NoSQL & devenir expert avec la console", "NoSQL drivers", "SQL"],
  },
  {
    _id: "MongoDB",
    parent: "Database",
    books: ["Introduction à MongoDB", "MongoDB aggrégation"],
  },
]);
```

Écrire un algorithme qui ajoute une propriété ancestors à la collection afin d'énumérer les catégories parentes. Vous utiliserez l'opérateur addToSet pour ajouter le/les parent(s) de chaque document.

Par exemple la catégorie MongoDB aurait la propriété ancestors suivante :

```js
db.categoriestree.find({ _id: "MongoDB" }, { ancestors: 1 });

/*
Doit afficher :
   {
      "_id" : "MongoDB",
      "ancestors" : [
         { "_id" : "Database" },
         { "_id" : "Programming" },
         { "_id" : "Books" }
      ]
   }
*/
```

```js
// get all documents
const categories = db.categoriestree.find().toArray();
// for each documents get parent id and add it to ancestors

// double loop to get all ancestors
for (let i = categories.length - 1; i >= 0; i--) {
  for (let j = i - 1; j >= 0; j--) {
    // starting from the previous document
    // add ancestor to current document
    db.categoriestree.updateOne(
      { _id: categories[i]._id },
      { $addToSet: { ancestors: categories[j]._id } }
    );
  }
}

db.categoriestree.find({ _id: "MongoDB" }, { ancestors: 1 });

db.categoriestree.find({ _id: "Database" }, { ancestors: 1 });

db.categoriestree.find({ _id: "Programming" }, { ancestors: 1 });
```

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

# Exercice facultatif

```js
async function totalGRadeAD(db) {
  // accès à la collection restaurants
  const restaurants = await db.collection("restaurants");

  // aggregation pipeline
  const res = await restaurants.aggregate([
    // trie sur brooklyn
    { $match: { borough: "Brooklyn" } },
    { $unwind: "$grades" },
    {
      $group: {
        _id: { name: "$name" },
        countA: { $sum: { $cond: [{ $eq: ["$grades.grade", "A"] }, 1, 0] } }, // somme des A
        countD: { $sum: { $cond: [{ $eq: ["$grades.grade", "D"] }, 1, 0] } }, // somme des D
      },
    },
  ]);

  return res; // retourne le total des documents
}
```
