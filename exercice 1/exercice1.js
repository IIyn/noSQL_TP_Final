
// Créer la base de données bookstore
use bookstore;

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

// get all books in category "Programmation"
db.books.find({
  category_id: db.categories.findOne({ name: "Programmation" })._id,
});

db.books
  .find({ category_id: db.categories.findOne({ name: "NoSQL" })._id })
  .count();

const newBooks = [
  { title: "Python & SQL" }, // programmation & SQL
  { title: "JS SQL ou NoSQL" }, // programmation
  { title: "Pandas & SQL & NoSQL" }, // SQL, NoSQL et programmation
  { title: "Modélisation des données" }, // aucune catégorie
];

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

db.books.find({ category_id: { $exists: false } });