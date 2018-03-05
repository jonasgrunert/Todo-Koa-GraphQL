// schema.js
// https://www.apollographql.com/docs/graphql-tools/generate-schema.html

const schemacontent = ` 
    type Query {  
        categories: [category]  
        category(title: String): category  
        tasks(state: Boolean, title: String): [task]  
        task(id: ID): task  
        dates: [date]  
        date(date: Date, from: Date, to: Date): [date]
        places: [place]  
        place(title: String): [place] 
    }  
    
    type Mutation {  
        createTask(task: createTask): task  
        editTask(task: editTask): task  
    }  
      
    type category {  
        title: String  
        tasks(state: Boolean): [task]  
    }  
    type task {  
        _id: ID!  
        title: String  
        state: Boolean  
        notes: String  
        date: date  
        place: place  
        category: category  
    }  
    type date {  
        date: Date  
        tasks(state: Boolean): [task]  
    }  
    type place {  
        title: String  
        tasks(state: Boolean): [task]  
    }  
      
    input editTask {  
        _id: ID!  
        title: String  
        state: Boolean  
        notes: String  
        date: Date  
        place: String  
        category: String  
    }  
    input createTask {  
        title: String!  
        state: Boolean  
        notes: String  
        date: Date  
        place: String  
        category: String  
    }  

    scalar Date
`;

export default schemacontent;
