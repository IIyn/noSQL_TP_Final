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