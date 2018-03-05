const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

const resolvercontent = {
  Query: {
    // args contains state, title
    tasks(obj, args, context, info){
      const db = Promise.promisifyAll(dbServer.use('default'));
      if (args.state) {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await db.viewAsync('todos', 'byState', { 'keys': [args.state]});
            let cb =[]
            result.rows.forEach(element => {
              cb.push(element.value)
            });
            resolve(cb);
          } catch (err) {
            reject(err);
          }
        });
      }
      return new Promise( async (resolve, reject) => {
        try {
          const result = await db.viewAsync('todos', 'byDefault');
          let cb =[]
          result.rows.forEach(element => {
            cb.push(element.value)
          });
          resolve(cb);
        } catch (err) {
          reject(err);
        }
      });
    },
    task(obj, args, context, info){
      const db = Promise.promisifyAll(dbServer.use('default'));
      if (args.id) {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await db.getAsync(args.id);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      }
      throw new Error("Missing id");
    },
  },
  task: {
    sameDate(obj, args, context, info){
      const db = Promise.promisifyAll(dbServer.use('default'));
      return new Promise(async (resolve, reject) => {
        try {
          const result = await db.viewAsync('todos', 'byDate', { 'keys': [obj.date] });
          let cb =[]
          result.rows.forEach(element => {
            if (obj._id !== element.value._id) {
              cb.push(element.value)
            }
          });
          resolve(cb);
        } catch (err) {
          reject(err);
        }
      });
    },
    samePlace(obj, args, context, info){
      const db = Promise.promisifyAll(dbServer.use('default'));
      return new Promise(async (resolve, reject) => {
        try {
          const result = await db.viewAsync('todos', 'byPlace', { 'keys': [obj.place] });
          let cb =[]
          result.rows.forEach(element => {
            if (obj._id !== element.value._id) {
              cb.push(element.value)
            }
          });
          resolve(cb);
        } catch (err) {
          reject(err);
        }
      });
    },
    sameCategory(obj, args, context, info){
      const db = Promise.promisifyAll(dbServer.use('default'));
      return new Promise(async (resolve, reject) => {
        try {
          const result = await db.viewAsync('todos', 'byCategory', { 'keys': [obj.category] });
          let cb =[]
          result.rows.forEach(element => {
            if (obj._id !== element.value._id) {
              cb.push(element.value)
            }
          });
          resolve(cb);
        } catch (err) {
          reject(err);
        }
      });
    },
  }
}

export default resolvercontent;
