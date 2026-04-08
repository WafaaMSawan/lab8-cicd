db = db.getSiblingDB("tasksdb");

db.tasks.insertMany([
  { id:7, name:"Tea", status:"pending"},
  { id:1, name:"Study", status:"pending"},
  { id:2, name:"Gym", status:"done"},
  { id:3, name:"Shopping", status:"pending"}
]);