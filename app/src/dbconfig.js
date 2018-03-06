module.exports = {
  dbConfig: {
    views: {
      byDefault: {
        map: function(doc){
          emit(doc._id, doc);
        },
      },
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

