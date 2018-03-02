schema {  
    query: Query  
    mutation: Mutation  
}  
  
Query {  
    categories: [category]  
    category(title: String): category  
    tasks: tasks  
    task(id: ID, title: String, state: Boolean): task  
    dates: [date]  
    date(date: Date, from: Date, to: Date): task  
    places: [place]  
    place(title: String): place  
}  
  
Mutation {  
    createTask(task: createTask): task  
    editTask(task: editTAsk): task  
}  
  
// Types  
type category {  
    title: String  
    tasks(state: Boolean): [task]  
}  
type task {  
    id: ID!  
    title: String  
    state: Boolean  
    notes: String  
    date: date  
    place: place  
    categories: [category]  
}  
type date {  
    date: Date  
    tasks(state: Boolean): [task]  
}  
type place {  
    title: String  
    tasks(state: Boolean): [task]  
}  
  
// Inputs  
input editTask {  
    id: ID!  
    title: String  
    state: Boolean  
    notes: String  
    date: Date  
    place: String  
    categories: [String]  
}  
input createTask {  
    title: String!  
    state: Boolean  
    notes: String  
    date: Date  
    place: String  
    categories: [String]  
}  
  
scalar Date // UNIX-formatted Date  