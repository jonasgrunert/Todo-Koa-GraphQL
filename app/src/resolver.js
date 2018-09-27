const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

const retrieveData = retrieve =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await retrieve();
      const cb = [];
      result.rows.forEach((element) => {
        cb.push(element.value);
      });
      resolve(cb);
    } catch (err) {
      reject(err);
    }
  });

const retrieveDataUnlessSame = (retrieve, obj) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await retrieve();
      const cb = [];
      result.rows.forEach((element) => {
        if (obj._id !== element.value._id) {
          cb.push(element.value);
        }
      });
      resolve(cb);
    } catch (err) {
      reject(err);
    }
  });

const retrieveAmount = retrieve =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await retrieve();
      const cb = [];
      result.rows.forEach((element) => {
        let flag = false;
        cb.forEach((ele, ind) => {
          if (ele.key) {
            if (ele.key === element.key) {
              flag = ind;
            }
          }
        });
        if (flag !== false) {
          cb[flag].count++;
        } else {
          cb.push({ key: element.key, count: 1 });
        }
      });
      resolve(cb);
    } catch (err) {
      reject(err);
    }
  });

const mergeArrays = (arr) => {
  const coll = [];
  [].concat(...arr).forEach((elm) => {
    let flag = true;
    coll.forEach((ele) => {
      if (elm._id === ele._id) {
        flag = false;
      }
    });
    if (flag) {
      coll.push(elm);
    }
  });
  return coll.sort((a, b) => {
    if (a._id < b._id) {
      return -1;
    }
    if (a._id > b._id) {
      return 1;
    }
    return 0;
  });
};

const createDb = (context) => {
  const dbAddress = context.state.user.sub === 'default' ? 'default' : `u${context.state.user.sub}`;
  const db = Promise.promisifyAll(dbServer.use(dbAddress));
  return db;
};

// db.viewAsync('todos', 'byDefault')

const resolvercontent = {
  Query: {
    // args contains state, title
    async tasks(obj, args, context, info) {
      const db = createDb(context);
      const coll = [];
      if (args.state) {
        coll.push(await retrieveData(() => db.viewAsync('todos', 'byState', { keys: [args.state] })));
      }
      if (args.date) {
        coll.push(await retrieveData(() => db.viewAsync('todos', 'byDate', { keys: [args.date] })));
      }
      if (args.place) {
        coll.push(await retrieveData(() => db.viewAsync('todos', 'byPlace', { keys: [args.place] })));
      }
      if (args.category) {
        coll.push(await retrieveData(() => db.viewAsync('todos', 'byCategory', { keys: [args.category] })));
      }
      if (args.state || args.place || args.date || args.category) {
        return mergeArrays(coll);
      }
      return retrieveData(() => db.viewAsync('todos', 'byDefault'));
    },
    task(obj, args, context, info) {
      const db = createDb(context);
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
      throw new Error('Missing id ast field task');
    },
    category(obj, args, context, info) {
      const db = createDb(context);
      if (args.title) {
        return retrieveData(() => db.viewAsync('todos', 'byCategory', { keys: [args.title] }));
      }
      throw new Error('Missing title at field category');
    },
    place(obj, args, context, info) {
      const db = createDb(context);
      if (args.title) {
        return retrieveData(() => db.viewAsync('todos', 'byPlace', { keys: [args.title] }));
      }
      throw new Error('Missing title at field place');
    },
    date(obj, args, context, info) {
      const db = createDb(context);
      if (args.date && (args.to || args.from)) {
        throw new Error('Too many parameters for field date');
      }
      if (args.date) {
        return retrieveData(() => db.viewAsync('todos', 'byDate', { keys: [args.date] }));
      }
      if (args.to && args.from) {
        return retrieveData(() =>
          db.viewAsync('todos', 'byDate', { startkey: args.from, endkey: args.to }));
      }
      throw new Error('Missing parameters for field date');
    },
    categories(obj, args, context, info) {
      return [{ key: 'TODO', count: 0 }];
    },
    places(obj, args, context, info) {
      return [{ key: 'TODO', count: 0 }];
    },
    dates() {
      return [{ key: 'TODO', count: 0 }];
    },
  },
  Task: {
    sameDate(obj, args, context, info) {
      const db = createDb(context);
      return retrieveDataUnlessSame(
        () => db.viewAsync('todos', 'byDate', { keys: [obj.date] }),
        obj,
      );
    },
    samePlace(obj, args, context, info) {
      const db = createDb(context);
      return retrieveDataUnlessSame(
        () => db.viewAsync('todos', 'byPlace', { keys: [obj.place] }),
        obj,
      );
    },
    sameCategory(obj, args, context, info) {
      const db = createDb(context);
      return retrieveDataUnlessSame(
        () => db.viewAsync('todos', 'byCategory', { keys: [obj.category] }),
        obj,
      );
    },
  },
  Mutation: {
    editTask(obj, args, context, info) {
      const db = createDb(context);
      return new Promise(async (resolve, reject) => {
        try {
          if (args.task._id) {
            let result = await db.getAsync(args.task._id);
            result = await db.insertAsync(Object.assign(result, args.task));
            result = await db.getAsync(result.id);
            resolve(result);
          } else {
            reject(new Error('No _id provided in input object task at field editTask'));
          }
        } catch (err) {
          reject(err);
        }
      });
    },
    createTask(obj, args, context, info) {
      const db = createDb(context);
      return new Promise(async (resolve, reject) => {
        try {
          if (args.task.title && args.task._id === undefined) {
            let result = await db.insertAsync(Object.assign({ state: false }, args.task));
            result = await db.getAsync(result.id);
            resolve(result);
          } else if (args.task.title === undefinded) {
            reject(new Error('No title provided in input object task at field createTask'));
          } else {
            reject(new Error('Must not provid _id in input object task at field createTask'));
          }
        } catch (err) {
          reject(err);
        }
      });
    },
  },
};

export default resolvercontent;
