db = db.getSiblingDB("admin");
db.auth("root", "1234");

db = db.getSiblingDB("lendBox");
db.dropDatabase();

// collection
db = db.getSiblingDB("lendBox");
db.createCollection("Ticket");
db.createCollection("Item");

// Item data(initial)
db.Item.insert({name:"IchigoJam", stock:0});
db.Item.insert({name:"MixJuice", stock:0});
db.Item.insert({name:"M01 LED", stock:0});
db.Item.insert({name:"M02 Serial", stock:0});

db.Item.insert({name:"Dake", stock:0});
db.Item.insert({name:"Igai", stock:0});
db.Item.insert({name:"DakeJacket", stock:0});

db.Item.insert({name:"Dyhook", stock:0});
db.Item.insert({name:"DPC", stock:0});

db.Item.insert({name:"カムロボ", stock:0});
db.Item.insert({name:"radish", stock:0});
db.Item.insert({name:"radish typeD", stock:0});
