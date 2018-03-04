const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

Promise.promisifyAll(dbServer);

export async function createDb(id = 'default') {
  return new Promise((resolve, reject) => {
    try {
      dbServer.db.createAsync(id);
      const db = dbServer.useAsync(id);
      db.insertAsnyc(
        {}, // view document
        '_design/todos',
      );
      db.insertAsync({
        // smaple data
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export default async function nano(ctx) {
  try {
    dbServer.db.getAsync(ctx.state.user);
  } catch (e) {
    try {
      createDb(ctx.state.user);
    } catch (err) {
      ctx.throw(err);
    }
  }
}
