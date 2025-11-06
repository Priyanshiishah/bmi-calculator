const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const os = require('os');

if (os.platform() === 'win32') {
    const dotenv = require('dotenv').config();
}

const arg2 = process.argv[2];

const url = process.env.DB_URL;

const client = new MongoClient(url);
const dbCol = 'patients';
let collFlag = null;
client.connect();
const db = client.db();

if (arg2 == 'database') {
    setupDB();
}

async function setupDB() {
    db.listCollections().toArray(async (err, coll) => {
        if (err) throw err;
        coll.forEach(async (element) => {
            if (dbCol == element.name) {
                console.log('Collection already exists!');
                collFlag = true;
                await exiting();
            }
        });
        if (!collFlag) {
            await client.db().createCollection(dbCol);
            console.log('Collection Created!');
            await readFile();
        }
    });
}

async function readFile() {
    let filePath = path.join(__dirname, '..', 'test', 'patients.json');

    let rawData = fs.readFileSync(filePath);
    let records = JSON.parse(rawData);
    db.collection(dbCol).insertMany(records, function (err, res) {
        if (err) throw err;
        console.log('Number of documents inserted: ' + res.insertedCount);
        exiting();
    });
}

async function exiting() {
    process.exit(0);
}

module.exports = { url, dbCol };
