import assert from 'node:assert/strict'

import { MongoClient, ObjectId } from 'mongodb'
import { configDotenv } from 'dotenv'

configDotenv()
assert(process.env.DB_URI)

export class DBEvent {
  constructor(
    public name: string,
    public threads: string[], // id
    public users: [string, string][], // id, port
    public retired: boolean,
    public id?: ObjectId,
  ) {}
}

const mongo = new MongoClient(process.env.DB_URI)
await mongo.connect()
export const dbEvents = mongo.db('eventdb').collection<DBEvent>('events')
