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
