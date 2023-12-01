const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;
app.use(cors());
app.use(bodyParser.json());

// Load initial data from JSON file
let todoData = require("./data.json");

// Save data to JSON file
const saveData = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todoData, null, 2));
};

app.get("/api/todos", (req, res) => {
  res.json(todoData);
});

app.post("/api/todos", (req, res) => {
  const { title, date } = req.body;
  const newItem = { id: Date.now(), title, date, done: false };

  todoData.push(newItem);
  saveData();

  res.json(newItem);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todoData = todoData.filter((item) => item.id !== id);
  saveData();

  res.json({ success: true, data: todoData });
});

app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = todoData.find((item) => item.id === id);

  if (item) {
    item.done = !item.done;
    saveData();
    res.json(todoData);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
