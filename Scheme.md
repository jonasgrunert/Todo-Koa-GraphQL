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

scalar Date // formatted String e.g. "2018-03-08"  