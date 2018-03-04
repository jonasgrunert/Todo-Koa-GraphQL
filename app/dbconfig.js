// couchdb
// https://www.npmjs.com/package/node-couchdb

import couchdb from 'node-couchdb';
import memcache from 'node-couchdb-plugin-memcached';

// node-couchdb instance with cache
const sofa = new couchdb ({
    host: '127.0.0.1',
    port: '5984',
    cache: new memcache
})

// create db
sofa.createDatabase(todocouch).then(() => {}, err => {
    return 'error'
})

// Sorted by date
function(doc){
    if(doc.date){
        //   key       value
        emit(doc.date, doc)
    }
}
// sorted by place
function(doc){
    if(doc.place){
        emit(doc.place, doc)
    }
}
// sorted by category
function(doc){
    if(doc.category){
        emit(doc.category, doc)
    }
}
// sorted by state
function(doc){
    if(doc.state){
        emit(doc.state, doc)
    }
}
// sorted by title
function(doc){
    if(doc.title){
        emit(doc.title, doc)
    }
}
// sorted by state and title
function(doc){
    if(doc.state && doc.title){
        emit([doc.state, doc.title], doc)
    }
}

// get view results
sofa.get("todocouch",viewURL, queryOptions).then(({data, headers, status}) => {
    // data is json response 
    // headers is an object with all response headers 
    // status is statusCode number 
}, err => {
    // either request error occured 
    // ...or err.code=EDOCMISSING if document is missing 
    // ...or err.code=EUNKNOWN if statusCode is unexpected 
});