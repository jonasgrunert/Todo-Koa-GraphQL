schema {
  query: Query
  mutation: Mutation
}

Query {
    categories: [category]
    category(id: ID, title: String): category
    tasks: tasks
    task(id: ID, title: String, state: Boolean): task
    dates: [date]
    date(id: ID, date: Date): task
    places: [place]
    place(id: ID, title: String): place
}

Mutation {
    createTask(task: createTask): task
    editTask(task: editTAsk): task
    createCategory(category: createCategory): category
    editCategory(category: editCategory): category
    createDate(date: createDate): date
    editDate(date: editDate): date
    createPlace(place: createPlace): place
    editPlace(place: editPlace): place
}

// Types
type category {
    id: ID!
    title: String
    tasks: [task]
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
    id: ID!
    date: Date
    tasks: [task]
}
type place {
    id: ID!
    title: String
    tasks: [task]
}

// Inputs

input editCategory {
    id: ID!
    title: String
}
input editTask {
    id: ID!
    title: String
    state: Boolean
    notes: String
    date: Date
    place: String
    categories: [String]
}
input editDate {
    id: ID!
    date: Date
}
input editPlace {
    id: ID!
    title: String
}

input createCategory {
    title: String!
}
input createTask {
    title: String!
    state: Boolean
    notes: String
    date: Date
    place: String
    categories: [String]
}
input createDate {
    date: Date!
}
input createPlace {
    title: String!
}

scalar Date // UNIX-formatted Date