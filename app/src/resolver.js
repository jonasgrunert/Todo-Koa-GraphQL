const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

Promise.promisifyAll(dbServer);

Query: {
  // args contains state, title
  tasks(obj, args, context, info) {
    if (args.state && args.title) {
      return db.viewAsync('todos', 'byStateAndTitle', { 'keys': [state, title]}).rows;
    }
    if (args.state) {
      return db.viewAsync('todos', 'byState', { 'keys': state}).rows;
    }
    if (args.title) {
      return new Promise((resolve, reject) => {
        try {
          const result = db.viewAsync('todos', 'byTitle', { 'keys': title})
          resolve(result.rows);
        } catch (err) {
          reject(err);
        }
      });
    }
    return db.viewAsync('todos', 'byDefault');
  }
}
