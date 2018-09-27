// schema.js
// https://www.apollographql.com/docs/graphql-tools/generate-schema.html

const schemacontent = ` 
    type Query {    
        category(title: String): [Task]  
        tasks(state: Boolean, date: Date, category: String, place: String): [Task]  
        task(id: ID): Task  
        date(date: Date, from: Date, to: Date): [Task]
        place(title: String): [Task]
        categories: [Group]
        dates: [Group]
        places: [Group]
    }  
    
    type Mutation {  
        createTask(task: createTask): Task  
        editTask(task: editTask): Task  
    }  
      
    type Task {  
        _id: ID!  
        title: String  
        state: Boolean  
        notes: String  
        date: Date  
        place: String  
        category: String
        sameDate: [Task]
        samePlace: [Task]
        sameCategory: [Task]  
    }
    
    type Group {
        key: String
        count: Int
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
