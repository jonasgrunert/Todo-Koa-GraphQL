const Promise = require('bluebird');
const dbServer = require('nano')('http://admin:my_admin_password@couchdb:5984');

const retrieveData = retrieve => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await retrieve();
      let cb =[];
      result.rows.forEach(element => {
        cb.push(element.value)
      });
      resolve(cb);
    } catch (err) {
      reject(err);
    }
  });
}

const retrieveDataUnlessSame = (retrieve, obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await retrieve();
      let cb =[];
      result.rows.forEach(element => {
        if(obj._id !== element.value._id){
          cb.push(element.value)
        }
      });
      resolve(cb);
    } catch (err) {
      reject(err);
    }
  });
}

//db.viewAsync('todos', 'byDefault')

const resolvercontent = {
  Query: {
    // args contains state, title
    tasks(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      if (args.state) {
        return retrieveData(() => {return db.viewAsync('todos', 'byState', { 'keys': [args.state]})});
      }
      return retrieveData(() => {return db.viewAsync('todos', 'byDefault')});
    },
    task(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
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
      throw new Error("Missing id ast field task");
    },
    category(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      if (args.title) {
        return retrieveData(() => {return db.viewAsync('todos', 'byCategory', { 'keys': [args.title]})});
      }
      throw new Error("Missing title at field category")
    },
    place(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      if (args.title) {
        return retrieveData(() =>{return db.viewAsync('todos', 'byPlace', { 'keys': [args.title]})});
      }
      throw new Error("Missing title at field place")
    },
    date(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      if (args.date && (args.to || args.from)){
        throw new Error("Too many parameters for field date");
      }
      if (args.date) {
        return retrieveData(()=> {return db.viewAsync('todos', 'byDate', { 'keys': [args.date]})});
      }
      if (args.to && args.from){
        return retrieveData(() => {return db.viewAsync('todos', 'byDate', { 'startkey': args.from, 'endkey': args.to})});
      }
      throw new Error("Missing parameters for field date");
    },
  },
  task: {
    sameDate(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      return retrieveDataUnlessSame(() => {return db.viewAsync('todos', 'byDate', { 'keys': [obj.date] })}, obj);
    },
    samePlace(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      return retrieveDataUnlessSame(() =>{return db.viewAsync('todos', 'byPlace', { 'keys': [obj.place] })}, obj);
    },
    sameCategory(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      return retrieveDataUnlessSame(() => {return db.viewAsync('todos', 'byCategory', { 'keys': [obj.category] })}, obj);
    },
  },
  Mutation: {
    editTask(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      return new Promise(async (resolve, reject) => {
        try {
          if (args.task._id){
            let result = await db.getAsync(args.task._id);
            result = await db.insertAsync(Object.assign(result, args.task));
            result = await db.getAsync(result.id);
            resolve(result);
          } else {
            reject(new Error("No _id provided in input object task at field editTask"));
          }
        } catch (err) {
          reject(err);
        }
      });
    },
    createTask(obj, args, context, info){
      const dbAddress = ((context.state.user.sub === 'default') ? 'default' : 'u'+context.state.user.sub);
      const db = Promise.promisifyAll(dbServer.use(dbAddress));
      return new Promise(async (resolve, reject) => {
        try {
          if (args.task.title && args.task._id === undefined){
            let result = await db.insertAsync(Object.assign({state: false},args.task));
            result = await db.getAsync(result.id);
            resolve(result);
          } else {
            if(args.task.title === undefinded){
              reject(new Error("No title provided in input object task at field createTask"));
            } else {
              reject(new Error("Must not provid _id in input object task at field createTask"));
            }
          }
        } catch (err) {
          reject(err);
        }
      });
    }
  }
}

export default resolvercontent;
