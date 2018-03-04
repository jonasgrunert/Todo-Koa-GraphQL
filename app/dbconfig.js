module.exports ={
  dbConfig: {
    views: {
      byDate: {
        // Sorted by date
        map: function(doc){
          if (doc.date) {
            emit(doc.date, doc);
          }
        },
      },
      byPlace: {
        // sorted by place
        map: function(doc){
          if (doc.place) {
            emit(doc.place, doc);
          }
        },
      },
      byCategory: {
        // sorted by category
        map: function(doc){
          if (doc.category && doc.category.length > 0) {
            emit(doc.category, doc);
          }
        },
      },
      byState: {
        // sorted by state
        map: function(doc){
          if (doc.state) {
            emit(doc.state, doc);
          }
        },
      },
      byTitle: {
        // sorted by title
        map: function(doc){
          if (doc.title) {
            emit(doc.title, doc);
          }
        },
      },
      byStateandTitle: {
        // sorted by state and title
        map: function(doc){
          if (doc.state && doc.title) {
            emit([doc.state, doc.title], doc);
          }
        },
      },
      byDateandState: {
        // sorted by date and state
        map: function(doc){
          if (doc.date && doc.state) {
            emit([doc.date, doc.state], doc);
          }
        },
      },
      byPlaceandState: {
        // sorted by place and state
        map: function(doc){
          if (doc.place && doc.state) {
            emit([doc.place, doc.state], doc);
          }
        },
      },
      byCategoryandState: {
        // sorted by category and state
        map: function(doc){
          if (doc.category && doc.state) {
            emit([doc.category, doc.state], doc);
          }
        },
      },
    },
  },
  sampleData: [
    {
      _id: '1',
      title: 'Buying apples',
      state: true,
      notes: 'big and red',
      place: 'Walmart',
      date: '2018-03-10',
      category: 'shopping',
    },
    {
      _id: '2',
      title: 'Buying tv',
      state: false,
      category: 'shopping',
    },
    {
      _id: '3',
      title: 'Program graphql',
      state: true,
      date: '2018-03-08',
      category: 'university',
    },
  ],
};

