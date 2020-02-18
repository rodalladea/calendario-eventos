const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

let conn = MongoClient.connect('mongodb://localhost:27017/calendario', {useNewUrlParser: true, useUnifiedTopology: true})
            .then(conn => {
                return {
                    db: conn.db('calendario'),
                    close: function() {
                        conn.close();
                    }
                };
            });


module.exports = class Mongo {
    save() {
        if (this._id) {
            this._id = ObjectId(this._id);
            return conn.then(conn => {
                return conn.db.collection(this.collection).updateOne({_id: this._id}, {$set: this});
            });
        }

        return conn.then(conn => {
            return conn.db.collection(this.collection).insertOne(this);
        });
    }

    delete() {
        if (this._id) {
            return conn.then(conn => {
                return conn.db.collection(this.collection).deleteOne({_id: ObjectId(this._id)});
            });
        }

        return null;
    }

    static find(query = {}, sort = {}, limit = 5, collection) {
        return conn.then(conn => {
            return conn.db.collection(collection).find(query).sort(sort).limit(limit).toArray();
        });
    }

    static close() {
        conn.then(conn => {
            conn.close();
        });
    }
}