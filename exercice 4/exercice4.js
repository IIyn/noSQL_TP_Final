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

export default totalGRadeAD;