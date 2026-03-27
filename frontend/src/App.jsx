import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchTodos() {
    try {
      setLoading(true);
      const todoResponse = await fetch("http://localhost:5000/api/todos");
      const todoData = await todoResponse.json();
      setTodos(todoData);
    } catch (err) {
      console.log("failed to fetch todos", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchTodos();
  },[]);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const addResponse = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todos ? todos.length + 1 : 1,
          title,
          completed: false,
        }),
      });

      const addData = await addResponse.json();
      console.log(addData);
      setTodos([addData.todo, ...todos]);
      setTitle("");
    } catch (err) {
      console.log("failed to add data", err);
    }
  }

  async function editTodo(id) {
    try {
      let updateTodo = todos.map((todo) => {
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
      });

      let toSendBackend = updateTodo.find((todo) => todo.id === id);
      setTodos(updateTodo);

      const editTodosResponse = await fetch(
        `http://localhost:5000/api/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...toSendBackend,
          }),
        }
      );

      console.log(editTodosResponse);
    } catch (err) {
      console.log("failed to update", err);
    }
  }

  async function deleteTodo(id) {
    try {
      const deleteResponse = await fetch(
        `http://localhost:5000/api/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      const deleteData = todos.filter((todo) => todo.id !== id);
      setTodos(deleteData);
      console.log(deleteResponse);
    } catch (err) {
      console.error("failed to delete data", err);
    }
  }

  return (
    <div className="App">
      <h1>TODO(MERN)</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a new task ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>

        {loading && <p>loading todos...</p>}

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span
                onClick={() => editTodo(todo.id)}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {todo.title}
              </span>
              <button type="button" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;