```js
// Create Collections with MongoDB Examples

// Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "role"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["user", "admin"] },
      },
    },
  },
});

// Categories Collection
db.createCollection("categories");

// Items Collection
db.createCollection("items", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "size", "category_id"],
      properties: {
        name: { bsonType: "string" },
        price: { bsonType: "decimal" },
        size: { enum: ["small", "medium", "large"] },
        category_id: { bsonType: "objectId" },
      },
    },
  },
});

// Orders Collection
db.createCollection("orders");

// Insert Records
db.categories.insertOne({
  name: "Electronics",
  description: "Electronic devices and accessories",
  created_at: new Date(),
  updated_at: new Date(),
});

db.items.insertOne({
  name: "Laptop",
  price: NumberDecimal("999.99"),
  size: "medium",
  quantity: 10,
  description: "High-performance laptop",
  category_id: ObjectId("category_id_here"),
  created_at: new Date(),
  updated_at: new Date(),
});

// Query Records (Using Lookup)
db.items.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "category_id",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $match: {
      quantity: { $gt: 0 },
    },
  },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $lookup: {
      from: "items",
      localField: "items.item_id",
      foreignField: "_id",
      as: "order_items",
    },
  },
  {
    $match: {
      status: "pending",
    },
  },
]);

// Update Records
db.items.updateMany(
  { category_id: ObjectId("category_id_here") },
  { $mul: { price: 1.1 } }
);

db.orders.updateMany(
  { user_id: ObjectId("user_id_here") },
  { $set: { status: "approved" } }
);

// Delete Records
db.items.deleteMany({ quantity: 0 });

db.orders.deleteMany({ status: "disapproved" });

// Complex Query with Multiple Lookups
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $lookup: {
      from: "items",
      localField: "items.item_id",
      foreignField: "_id",
      as: "items",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "admin_id",
      foreignField: "_id",
      as: "admin",
    },
  },
  {
    $project: {
      _id: 1,
      "user.name": 1,
      "items.name": 1,
      "admin.name": 1,
      status: 1,
      order_date: 1,
    },
  },
]);
```
