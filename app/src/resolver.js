const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

const resolvercontent = {
  Query: {
    // args contains state, title
    tasks(obj, args, context, info){
      const db = Promise.promisifyAll(dbServer.use('default'));
      if (args.state && args.title) {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await db.viewAsync('todos', 'byStateAndTitle', { 'keys': [state, title]}).rows;
            resolve(result.rows);
          } catch (err) {
            reject(err);
          }
        });
      }
      if (args.state) {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await db.viewAsync('todos', 'byState', { 'keys': state}).rows;
            resolve(result.row);
          } catch (err) {
            reject(err);
          }
        });
      }
      if (args.title) {
        return new Promise( async(resolve, reject) => {
          try {
            const result = await db.viewAsync('todos', 'byTitle', { 'keys': title})
            resolve(result.rows);
          } catch (err) {
            reject(err);
          }
        });
      }
      return new Promise( async (resolve, reject) => {
        try {
          const result = await db.viewAsync('todos', 'byDefault');
          resolve(result.row);
        } catch (err) {
          reject(err);
        }
      });
    }
  }
}

export default resolvercontent;
