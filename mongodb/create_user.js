// rootユーザ
db = db.getSiblingDB("admin");
db.createUser({
    user: "root",
    pwd: "1234",
    roles: [{ role: "root", db: "admin" }]
});

// 一般ユーザ
db = db.getSiblingDB("lendBox");
db.createUser({
	user: "user",
	pwd:"1234",
	roles:[{role: "readWrite", db:"lendBox"}]
});
