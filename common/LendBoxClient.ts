import { Database, MongoClient } from 'mongo/mod.ts';

interface IItem {
    itemid: Number;
    name: String;
    stock: Number;
}

class LendBox {
    _db: Database | null;

    constructor() {
        const usr = Deno.env.get('MONGO_USR');
        const port = Deno.env.get('MONGO_PORT');
        const host = Deno.env.get('MONGO_HOST');
        const pwd = Deno.env.get('MONGO_PWD');
        const dbname = Deno.env.get('MONGO_DB');
        const strConnect = `mongodb://${usr}:${pwd}@${host}:${port}/${dbname}`;

        const client = new MongoClient();

        this._db = null;
        client.connect(strConnect)
            .then(() => {
                this._db = client.database(dbname);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async getAllItem(): Promise<IItem[] | null> {
        if (this._db === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }

        const collectionItem = this._db.collection<IItem>('Item');
        return collectionItem.find().toArray();
    }
}

export const LendBoxClient = new LendBox();
