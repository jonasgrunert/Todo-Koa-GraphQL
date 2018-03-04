const dbConfig = {
  "views": {
    "byDate": {
      "map": // Sorted by date
        function(doc){
          if(doc.date){
            //key, value
            emit(doc.date, doc)
          }
        }
    },
    "byPlace": {
      "map": // sorted by place
        function(doc){
          if(doc.place){
            emit(doc.place, doc)
          }
        }
    },
    "byCategory": {
      "map": // sorted by category
        function(doc){
          if(doc.category && doc.category.length > 0){
            for(var i in doc.category) {
              emit(doc.category[i], doc);
            }
          }
        }
    },
    "byState": {
      "map": // sorted by state
        function(doc){
          if(doc.state){
            emit(doc.state, doc)
          }
        }
    },
    "byTitle": {
      "map": // sorted by title
        function(doc){
          if(doc.title){
            emit(doc.title, doc)
          }
        }
    },
    "byStateandTitle": {
      "map": // sorted by state and title
        function(doc){
          if(doc.state && doc.title){
            emit([doc.state, doc.title], doc)
          }
        }
    },
    "byDateandState": {
      "map": //sorted by date and state
        function(doc){
          if(doc.date && doc.state){
            emit([doc.date, doc.state], doc)
          }
        }
    },
    "byPlaceandState": {
      "map": //sorted by place and state
        function(doc){
          if(doc.place && doc.state){
            emit([doc.place, doc.state], doc)
          }
        }
    },
    "byCategoryandState": {
      "map": //sorted by category and state
        function(doc){
          if(doc.category && doc.state){
            for(var i in doc.category) {
              emit([doc.category[i], doc.state], doc);
            }
          }
        }
    },
  }
};

export const sampleData = [
  {
    _id: 1,
    title: "Buying apples",
    state: true,
    notes: "big and red",
    place: "Walmart",
    date: "2018-03-10",
    category: ["shopping", "fresh"],
  },
  {
    _id: 2,
    title: "Buying tv",
    state: false,
    category: ["shopping"],
  },
  {
    _id: 3,
    title: "Program graphql",
    state: true,
    date: "2018-03-08",
    category: ["university"],
  },
];

export default dbConfig;

