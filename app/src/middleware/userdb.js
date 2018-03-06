const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');
const dbConfig = require('../dbconfig');

export async function createDb(id = 'default') {
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
  } catch (err) {
    throw new Error("Something went wrong while creating the database");
  }
}

export default async function nano(ctx, next) {
  try {
    if (ctx.state.user !== undefined) {
      const result =dbServer.db.list(async (err, result) => {
        if (!result.includes('u'+ctx.state.user.sub)){
          await createDb('u'+ctx.state.user.sub);
        }
      });
    } else {
     ctx.state.user = { sub: 'default'};
    }
    return next();
  } catch (err) {
    ctx.throw(err);
    return next();
  }
}
