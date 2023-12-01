import React, { useState, useEffect } from "react";
import "./App.css";
import Todo from "./Todo";
function App() {
  const [todos, setTodos] = useState([]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  let curr = new Date();
  let week = [];
  curr.setDate(curr.getDate() - curr.getDay() + 7 + (page - 1) * 7);
  for (let i = 0; i <= 6; i++) {
    let first = curr.getDate() - curr.getDay() + i;
    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    let data = new Date(day);
    week.push({
      curr_day: data.getDay(),
      curr_date: data.getDate(),
      curr_month: data.getMonth() + 1,
      curr_year: data.getFullYear(),
    });
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleAddTodo = (newTodo) => {
    if (newTodo.title && newTodo.date) {
      fetch("http://localhost:3001/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos([...todos, data]);
          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };
  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:3001/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(todos.filter((todo) => todo.id !== id));
      });
  };
  const handleToggleDone = (id) => {
    fetch(`http://localhost:3001/api/todos/${id}`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        setTodos(updatedTodo);
      });
  };

  const checkDate = (item1, item) => {
    const newDate = `${item.curr_year}-${item.curr_month}-${item.curr_date}`;

    return newDate === item1;
  };
  return (
    <div className="App">
      <h1 className="heading">Awesome To Do App</h1>
      <ul className="week_day">
        {week.map((item) => (
          <li key={item.curr_day} className="week_day_item">
            <div className="list">
              <span>{weekDays[item.curr_day]}</span>
              <span>{item.curr_date}</span>
            </div>
            <Todo
              handleAddTodo={handleAddTodo}
              handleToggleDone={handleToggleDone}
              handleDeleteTodo={handleDeleteTodo}
              item={item}
              todos={todos.filter((item1) => checkDate(item1.date, item))}
            />
          </li>
        ))}
      </ul>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => setPage((prev) => prev - 1)}>Previous</button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
}
export default App;
