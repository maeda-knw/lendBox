db = db.getSiblingDB("admin");
db.auth("root", "1234");

db = db.getSiblingDB("lendBox");
db.dropDatabase();

// collection
db = db.getSiblingDB("lendBox");
db.createCollection("Ticket");
db.createCollection("Item");

// Item data(initial)
db.Item.insert({itemid: 1, name:"IchigoJam", stock:0});
db.Item.insert({itemid: 2, name:"MixJuice", stock:0});
db.Item.insert({itemid: 3, name:"M01 LED", stock:0});
db.Item.insert({itemid: 4, name:"M02 Serial", stock:0});

db.Item.insert({itemid: 5, name:"Dake", stock:0});
db.Item.insert({itemid: 6, name:"Igai", stock:0});
db.Item.insert({itemid: 7, name:"DakeJacket", stock:0});

db.Item.insert({itemid: 8, name:"Dyhook", stock:0});
db.Item.insert({itemid: 9, name:"DPC", stock:0});

db.Item.insert({itemid: 10, name:"カムロボ", stock:0});
db.Item.insert({itemid: 11, name:"radish", stock:0});
db.Item.insert({itemid: 12, name:"radish typeD", stock:0});
