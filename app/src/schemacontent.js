// schema.js
// https://www.apollographql.com/docs/graphql-tools/generate-schema.html

const schemacontent = ` 
    type Query {    
        category(title: String): [task]  
        tasks(state: Boolean): [task]  
        task(id: ID): task  
        date(date: Date, from: Date, to: Date): [task]
        place(title: String): [task] 
    }  
    
    type Mutation {  
        createTask(task: createTask): task  
        editTask(task: editTask): task  
    }  
      
    type task {  
        _id: ID!  
        title: String  
        state: Boolean  
        notes: String  
        date: Date  
        place: String  
        category: String
        sameDate: [task]
        samePlace: [task]
        sameCategory: [task]  
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
