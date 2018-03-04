import dbConfig, { sampleData } from '../../dbconfig';

const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

export async function createDb(id = 'default') {
  return new Promise(async (resolve, reject) => {
    try {
      dbServer.db.create(id, async (e, body) => {
        if (!e) {
          console.log('Database created');
        } else {
          console.log(e);
        }
        const db = Promise.promisifyAll(dbServer.use(id));
        await db.insertAsync(
          dbConfig, // view document
          '_design/todos',
        );
        if (id === 'default') {
          sampleData.forEach(async (data) => {
            await db.insertAsync(data);
          });
        }
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export default async function nano(ctx) {
  try {
    await dbServer.db.getAsync(ctx.state.user);
  } catch (e) {
    try {
      await createDb(ctx.state.user);
    } catch (err) {
      ctx.throw(err);
    }
  }
}
