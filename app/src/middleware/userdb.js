const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');
const dbConfig = require('../../dbconfig');

export async function createDb(id = 'default') {
  return new Promise(async (resolve, reject) => {
    try {
      dbServer.db.create(id, async () => {
        const db = Promise.promisifyAll(dbServer.use(id));
        await db.insertAsync(
          dbConfig.dbConfig, // view document
          '_design/todos',
        );
        if (id === 'default') {
          dbConfig.sampleData.forEach(async (data) => {
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
