import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
const { MONGO_DB_USER, MONGO_DB_PASSWORD } = process.env
const URI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@database.06wvde0.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('database')
    return database.collection('users')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class UserModel {
  static async getAll ({ country, region, text, page = 1, size = 10 }) {
    const db = await connect()

    let query = {}
    if (country) {
      query = {
        ...query,
        country
      }
    }

    if (region) {
      query = {
        ...query,
        region
      }
    }

    if (text) {
      query = {
        ...query,
        $or: [
          {
            name: {
              $regex: text,
              $options: 'i'
            }
          },
          {
            email: {
              $regex: text,
              $options: 'i'
            }
          }
        ]
      }
    }

    const pageInt = Number(page)
    const sizeInt = Number(size)
    const skip = pageInt * sizeInt - sizeInt

    const array = await db.find(query).limit(sizeInt).skip(skip).toArray()
    return array.map(({ _id, ...el }) => ({ id: _id, ...el }))
  }

  static async create ({ input }) {
    const db = await connect()

    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const newDocument = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })
    return !!newDocument
  }

  static async deleteAll () {
    const db = await connect()
    const { deletedCount } = await db.deleteMany()
    return deletedCount > 0
  }
}
