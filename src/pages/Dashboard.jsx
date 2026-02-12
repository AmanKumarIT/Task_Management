import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [newCategory, setNewCategory] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    category: ""
  });

  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    setCategories(data);
  };

  const fetchTasks = async () => {
    const { data } = await axios.get("/tasks");
    setTasks(data.filter(t => t.status !== "failure"));
  };

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await axios.post("/categories", { name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category and all its tasks?"
    );
    if (!confirmDelete) return;

    await axios.delete(`/categories/${id}`);
    fetchCategories();
    fetchTasks();
  };

  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.category) return;
    await axios.post("/tasks", taskForm);
    setTaskForm({ title: "", description: "", deadline: "", category: "" });
    fetchTasks();
  };

  const markSuccess = async (id) => {
    await axios.put(`/tasks/${id}/success`);
    fetchTasks();
  };

  const markFailure = async (id) => {
    await axios.put(`/tasks/${id}/failure`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditForm(task);
  };

  const saveEdit = async () => {
    await axios.put(`/tasks/${editingTaskId}`, editForm);
    setEditingTaskId(null);
    fetchTasks();
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1>{user?.name}'s Dashboard</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="input-section">
        <input
          className="styled-input"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="primary-btn" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <div className="input-section">
        <input
          className="styled-input"
          placeholder="Task Title"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
        />
        <input
          className="styled-input"
          placeholder="Description"
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
        />
        <input
          type="date"
          className="styled-input"
          value={taskForm.deadline}
          onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
        />
        <select
          className="styled-input"
          value={taskForm.category}
          onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <button className="primary-btn" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {categories.map(category => (
        <div key={category._id} className="category-section">
          <div className="category-header">
            <h2>{category.name}</h2>
            <button
              className="category-delete-x"
              onClick={() => deleteCategory(category._id)}
            >
              ×
            </button>
          </div>

          {tasks
  .filter(task => task.category?._id === category._id)
  .map(task => (
    <div
      key={task._id}
      className={`task-card ${
        task.status === "success" ? "success-task" : ""
      }`}
    >
      {editingTaskId === task._id ? (
        <div className="edit-section">
          <input
            className="styled-input"
            value={editForm.title || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
          />

          <input
            className="styled-input"
            value={editForm.description || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
          />

          <input
            type="date"
            className="styled-input"
            value={
              editForm.deadline
                ? editForm.deadline.substring(0, 10)
                : ""
            }
            onChange={(e) =>
              setEditForm({ ...editForm, deadline: e.target.value })
            }
          />

          <div className="edit-buttons">
            <button onClick={saveEdit}>💾</button>
            <button onClick={() => setEditingTaskId(null)}>✖</button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>

            {task.deadline && (
              <p className="deadline">
                Deadline:{" "}
                {new Date(task.deadline).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="task-actions">
            {task.status !== "success" && (
              <button onClick={() => markSuccess(task._id)}>✔</button>
            )}
            <button onClick={() => markFailure(task._id)}>✖</button>
            <button onClick={() => startEdit(task)}>✏</button>
          </div>
        </>
      )}
    </div>
  ))}


          {/* {tasks
            .filter(task => task.category?._id === category._id)
            .map(task => (
              <div
                key={task._id}
                className={`task-card ${
                  task.status === "success" ? "success-task" : ""
                }`}
              >
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>

                  {task.deadline && (
                    <p className="deadline">
                      Deadline:{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="task-actions">
                  {editingTaskId === task._id ? (
                    <>
                      <button onClick={saveEdit}>💾</button>
                    </>
                  ) : (
                    <>
                      {task.status !== "success" && (
                        <button onClick={() => markSuccess(task._id)}>✔</button>
                      )}
                      <button onClick={() => markFailure(task._id)}>✖</button>
                      <button onClick={() => startEdit(task)}>✏</button>
                    </>
                  )}
                </div>
              </div>
            ))} */}
        </div>
      ))}

      <button
        className="floating-btn"
        onClick={() => navigate("/failed")}
      >
        Show Failed Tasks
      </button>
    </div>
  );
}

export default Dashboard;
