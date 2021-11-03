import {
    Bson,
    Collection,
    ConnectOptions,
    Database,
    Filter,
    MongoClient,
} from 'mongo/mod.ts';

interface IItem {
    name: String;
    stock: Number;
}

export interface ITicketItem {
    name: String;
    amount: Number;
}

export interface ITicket {
    _id?: Bson.ObjectId;
    registry: Date;
    title: String;
    send: Date;
    receive: Date;
    items: ITicketItem[];
    state: status;
}

export const enum status {
    prepare = 1,
    ready = 2,
    lending = 3,
    completion = 4,
    deleted = 5,
}

class LendBox {
    private _client: MongoClient;

    constructor() {
        this._client = new MongoClient();
    }

    private async connect(): Promise<Database> {
        const usr = Deno.env.get('MONGO_USR') ?? 'user';
        const port = Deno.env.get('MONGO_PORT') ?? '27017';
        const host = Deno.env.get('MONGO_HOST') ?? '127.0.0.1';
        const pwd = Deno.env.get('MONGO_PWD') ?? '1234';
        const db = Deno.env.get('MONGO_DB') ?? 'lendBox';
        const option: ConnectOptions = {
            db: db,
            servers: [{
                host: host,
                port: Number(port),
            }],
            credential: {
                username: usr,
                password: pwd,
                db: db,
                mechanism: 'SCRAM-SHA-1',
            },
        };

        return new Promise<Database>((resolve, reject) => {
            this._client.connect(option)
                .then((database) => {
                    resolve(database);
                })
                .catch((err) => {
                    console.log('connection error');
                    this._client.close();
                    reject(err);
                });
        });
    }

    private close(): void {
        this._client.close();
    }

    private async getItemCollection(
        database: Database,
    ): Promise<Collection<IItem>> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(database.collection<IItem>('Item'));
            } catch (err) {
                reject(err);
            }
        });
    }

    async getAllItem(): Promise<IItem[]> {
        return new Promise<IItem[]>(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getItemCollection(database);
                const arrRawItem = await collection.find().toArray();
                const arrItem = arrRawItem.map((elem) => {
                    return {
                        name: elem.name,
                        stock: elem.stock,
                    };
                });
                resolve(arrItem);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }

    private async getTicketCollection(
        database: Database,
    ): Promise<Collection<ITicket>> {
        return new Promise<Collection<ITicket>>(async (resolve, reject) => {
            try {
                resolve(database.collection<ITicket>('Ticket'));
            } catch (err) {
                reject(err);
            }
        });
    }

    async insertTicket(ticket: ITicket): Promise<Bson.ObjectId> {
        return new Promise(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getTicketCollection(database);
                const id = await collection.insertOne(ticket);
                resolve(id);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }

    async getTicket(filter?: Filter<ITicket>): Promise<ITicket[]> {
        return new Promise<ITicket[]>(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getTicketCollection(database);
                const arrTicket = await collection.find(filter).toArray();
                resolve(arrTicket);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }

    async getCompletionTicket(): Promise<ITicket[]> {
        return this.getTicket({ state: status.completion });
    }

    async getNonCompletionTicket(): Promise<ITicket[]> {
        return this.getTicket({
            $and: [
                { state: { $ne: status.completion } },
                { state: { $ne: status.deleted } },
            ],
        });
    }

    async getDeletedTicket(): Promise<ITicket[]> {
        return this.getTicket({ state: status.deleted });
    }

    async updateTicket(
        id: Bson.ObjectId,
        title?: String,
        send?: Date,
        receive?: Date,
        items?: ITicketItem[],
        state?: status,
    ) {
        return new Promise<Number>(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getTicketCollection(database);
                const arrTicket = await collection.find({ _id: id }).toArray();
                if (arrTicket.length === 0) {
                    reject(new Error('find no ticket'));
                    return;
                }

                let updating = {};
                if (title) Object.assign(updating, { title: title });
                if (send) Object.assign(updating, { send: send });
                if (receive) Object.assign(updating, { receive: receive });
                if (items) Object.assign(updating, { items: items });
                if (state) Object.assign(updating, { state: state });

                const updateInfo = await collection.updateOne(
                    { _id: id },
                    { $set: updating },
                );
                resolve(updateInfo.modifiedCount);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }
}

export const LendBoxClient = new LendBox();
