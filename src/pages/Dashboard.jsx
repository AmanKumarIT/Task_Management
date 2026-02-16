// import { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../api/axios";
// import { AuthContext } from "../context/AuthContext";

// function Dashboard() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   const [newCategory, setNewCategory] = useState("");
//   const [taskForm, setTaskForm] = useState({
//     title: "",
//     description: "",
//     deadline: "",
//     category: ""
//   });

//   const fetchCategories = async () => {
//     const { data } = await axios.get("/categories");
//     setCategories(data);
//   };

//   const fetchTasks = async () => {
//     const { data } = await axios.get("/tasks");
//     setTasks(data.filter(t => t.status !== "failure"));
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchTasks();
//   }, []);

//   const handleAddCategory = async () => {
//   if (!newCategory.trim()) return;

//   const exists = categories.some(
//     c => c.name.toLowerCase() === newCategory.toLowerCase()
//   );

//   if (exists) {
//     alert("Category already exists");
//     return;
//   }

//   await axios.post("/categories", { name: newCategory });
//   setNewCategory("");
//   fetchCategories();
// };

// const previousTitles = [
//   ...new Set(tasks.map(task => task.title))
// ];


//   const deleteCategory = async (id) => {
//   const confirmDelete = window.confirm(
//     "Delete this category and all tasks?"
//   );
//   if (!confirmDelete) return;

//   setCategories(prev => prev.filter(c => c._id !== id));
//   setTasks(prev => prev.filter(t => t.category?._id !== id));

//   try {
//     await axios.delete(`/categories/${id}`);
//   } catch (err) {
//     console.error(err);
//   }
// };


//  const handleAddTask = async () => {
//   if (!taskForm.title || !taskForm.category) return;

//   const selectedCategory = categories.find(
//     c => c._id === taskForm.category
//   );

//   const tempId = Date.now();

//   const tempTask = {
//     ...taskForm,
//     _id: tempId,
//     status: "pending",
//     category: selectedCategory
//   };

//   // Optimistic update
//   setTasks(prev => [...prev, tempTask]);

//   setTaskForm({ title: "", description: "", deadline: "", category: "" });

//   try {
//     const { data } = await axios.post("/tasks", taskForm);

//     // Ensure category structure is consistent
//     const normalizedTask = {
//       ...data,
//       category: selectedCategory
//     };

//     setTasks(prev =>
//       prev.map(task =>
//         task._id === tempId ? normalizedTask : task
//       )
//     );
//   } catch (err) {
//     console.error(err);
//   }
// };



//   const markSuccess = async (id) => {
//   setTasks(prev =>
//     prev.map(task =>
//       task._id === id
//         ? { ...task, status: "success" }
//         : task
//     )
//   );

//   try {
//     await axios.put(`/tasks/${id}/success`);
//   } catch (err) {
//     console.error(err);
//   }
// };


//   const markFailure = async (id) => {
//   setTasks(prev => prev.filter(t => t._id !== id)); // instant remove

//   try {
//     await axios.put(`/tasks/${id}/failure`);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const autoDetectCategory = (title) => {
//   const lowerTitle = title.toLowerCase();

//   for (let categoryName in autoTagKeywords) {
//     const keywords = autoTagKeywords[categoryName];

//     if (keywords.some(keyword => lowerTitle.includes(keyword))) {
//       const matchedCategory = categories.find(
//         c => c.name.toLowerCase() === categoryName.toLowerCase()
//       );

//       if (matchedCategory) {
//         setTaskForm(prev => ({
//           ...prev,
//           category: matchedCategory._id
//         }));
//       }
//     }
//   }
// };


//   const startEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditForm(task);
//   };

//   const saveEdit = async () => {
//   setTasks(prev =>
//     prev.map(task =>
//       task._id === editingTaskId
//         ? { ...task, ...editForm }
//         : task
//     )
//   );

//   setEditingTaskId(null);

//   try {
//     await axios.put(`/tasks/${editingTaskId}`, editForm);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const categorySuggestions = [
//   "Internships",
//   "Hackathons",
//   "Projects",
//   "Exams",
//   "Assignments",
//   "Personal Goals",
//   "Fitness",
//   "Learning",
//   "Job Applications",
//   "Freelance Work"
// ];

// const autoTagKeywords = {
//   Internships: ["intern", "internship", "apply", "job"],
//   Hackathons: ["hackathon", "competition", "contest"],
//   Projects: ["project", "build", "develop"],
//   Exams: ["exam", "test", "quiz"],
//   Assignments: ["assignment", "homework"],
//   Fitness: ["gym", "workout", "run"],
//   Learning: ["learn", "course", "study"],
//   "Job Applications": ["resume", "cv", "interview"]
// };


//   return (
//     <div className="dashboard fade-in">
//       <div className="dashboard-header">
//         <h1>{user?.name}'s Dashboard</h1>
//         <button className="logout-btn" onClick={logout}>Logout</button>
//       </div>

//       <div className="input-section">
//         <input
//           className="styled-input"
//           list="category-suggestions"
//           placeholder="New Category"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//          />
         
//          <datalist id="category-suggestions">
//            {categorySuggestions.map((suggestion, index) => (
//              <option key={index} value={suggestion} />
//            ))}
//          </datalist>

//         <button className="primary-btn" onClick={handleAddCategory}>
//           Add Category
//         </button>
//       </div>

//       <div className="input-section">
//         <input
//         className="styled-input"
//         list="task-title-suggestions"
//         placeholder="Task Title"
//         value={taskForm.title}
//         onChange={(e) => {
//           const value = e.target.value;
//           setTaskForm({ ...taskForm, title: value });
//           autoDetectCategory(value);
//         }}
//       />
//       <datalist id="task-title-suggestions">
//       {previousTitles.map((title, index) => (
//       <option key={index} value={title} />
//       ))}
//       </datalist>


//         <input
//           className="styled-input"
//           placeholder="Description"
//           value={taskForm.description}
//           onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
//         />
//         <input
//           type="date"
//           className="styled-input"
//           value={taskForm.deadline}
//           onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
//         />
//         <select
//           className="styled-input"
//           value={taskForm.category}
//           onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
//         >
//           <option value="">Select Category</option>
//           {categories.map(cat => (
//             <option key={cat._id} value={cat._id}>{cat.name}</option>
//           ))}
//         </select>
//         <button className="primary-btn" onClick={handleAddTask}>
//           Add Task
//         </button>
//       </div>

//       {categories.map(category => (
//         <div key={category._id} className="category-section">
//           <div className="category-header">
//             <h2>{category.name}</h2>
//             <button
//               className="category-delete-x"
//               onClick={() => deleteCategory(category._id)}
//             >
//               ×
//             </button>
//           </div>

//           {tasks
//   .filter(task => task.category?._id === category._id)
//   .map(task => (
//     <div
//       key={task._id}
//       className={`task-card ${
//         task.status === "success" ? "success-task" : ""
//       }`}
//     >
//       {editingTaskId === task._id ? (
//         <div className="edit-section">
//           <input
//             className="styled-input"
//             value={editForm.title || ""}
//             onChange={(e) =>
//               setEditForm({ ...editForm, title: e.target.value })
//             }
//           />

//           <input
//             className="styled-input"
//             value={editForm.description || ""}
//             onChange={(e) =>
//               setEditForm({ ...editForm, description: e.target.value })
//             }
//           />

//           <input
//             type="date"
//             className="styled-input"
//             value={
//               editForm.deadline
//                 ? editForm.deadline.substring(0, 10)
//                 : ""
//             }
//             onChange={(e) =>
//               setEditForm({ ...editForm, deadline: e.target.value })
//             }
//           />

//           <div className="edit-buttons">
//             <button onClick={saveEdit}>💾</button>
//             <button onClick={() => setEditingTaskId(null)}>✖</button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div>
//             <h4>{task.title}</h4>
//             <p>{task.description}</p>

//             {task.deadline && (
//               <p className="deadline">
//                 Deadline:{" "}
//                 {new Date(task.deadline).toLocaleDateString()}
//               </p>
//             )}
//           </div>

//           <div className="task-actions">
//             {task.status !== "success" && (
//               <button onClick={() => markSuccess(task._id)}>✔</button>
//             )}
//             <button onClick={() => markFailure(task._id)}>✖</button>
//             <button onClick={() => startEdit(task)}>✏</button>
//           </div>
//         </>
//       )}
//     </div>
//   ))}
//         </div>
//       ))}

//       <button
//         className="floating-btn"
//         onClick={() => navigate("/failed")}
//       >
//         Show Failed Tasks
//       </button>
//     </div>
//   );
// }

// export default Dashboard;



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
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    category: "",
    progress: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    setCategories(data);
  };

  const fetchTasks = async () => {
    const { data } = await axios.get("/tasks");
    setTasks(data.filter(t => t.status !== "failure"));
  };

  /* ================= CATEGORY ================= */

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    await axios.post("/categories", { name: newCategory });
    setNewCategory("");
    setShowCategoryInput(false);
    fetchCategories();
  };

  const toggleCategory = (id) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /* ================= TASK ================= */

  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.category) return;

    const selectedCategory = categories.find(
      c => c._id === taskForm.category
    );

    const tempId = Date.now();

    const tempTask = {
      ...taskForm,
      _id: tempId,
      status: "pending",
      category: selectedCategory
    };

    setTasks(prev => [...prev, tempTask]);

    setTaskForm({
      title: "",
      description: "",
      deadline: "",
      category: "",
      progress: 0
    });

    try {
      const { data } = await axios.post("/tasks", taskForm);
      setTasks(prev =>
        prev.map(task =>
          task._id === tempId
            ? { ...data, category: selectedCategory }
            : task
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markSuccess = async (id) => {
    setTasks(prev =>
      prev.map(task =>
        task._id === id ? { ...task, status: "success" } : task
      )
    );
    try {
      await axios.put(`/tasks/${id}/success`);
    } catch (err) {
      console.error(err);
    }
  };

  const markFailure = async (id) => {
    setTasks(prev => prev.filter(task => task._id !== id));
    try {
      await axios.put(`/tasks/${id}/failure`);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProgress = async (id, change) => {
    setTasks(prev =>
      prev.map(task =>
        task._id === id
          ? {
              ...task,
              progress: Math.min(
                100,
                Math.max(0, (task.progress || 0) + change)
              )
            }
          : task
      )
    );

    try {
      await axios.put(`/tasks/${id}`, {
        progress: tasks.find(t => t._id === id)?.progress
      });
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditForm(task);
  };

  const saveEdit = async () => {
    setTasks(prev =>
      prev.map(task =>
        task._id === editingTaskId
          ? { ...task, ...editForm }
          : task
      )
    );
    setEditingTaskId(null);

    try {
      await axios.put(`/tasks/${editingTaskId}`, editForm);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToCategory = (id) => {
    document
      .getElementById(`category-${id}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dashboard fade-in">

      {/* ===== NAVBAR ===== */}
      <div className="top-navbar">
        {categories.map(cat => (
          <button
            key={cat._id}
            className="nav-pill"
            onClick={() => scrollToCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="dashboard-header">
        <h1>{user?.name}'s Dashboard</h1>
        <button className="fixed-logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* ===== ADD CATEGORY TOGGLE ===== */}
      <div className="category-add-container">
        <button
          className="circle-add-btn"
          onClick={() => setShowCategoryInput(!showCategoryInput)}
        >
          +
        </button>

        {showCategoryInput && (
          <div className="category-input-box">
            <input
              className="styled-input"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>✔</button>
          </div>
        )}
      </div>

      {/* ===== ADD TASK ===== */}
      <div className="input-section">
        <input
          className="styled-input"
          placeholder="Task Title"
          value={taskForm.title}
          onChange={(e) =>
            setTaskForm({ ...taskForm, title: e.target.value })
          }
        />

        <input
          className="styled-input"
          placeholder="Description"
          value={taskForm.description}
          onChange={(e) =>
            setTaskForm({ ...taskForm, description: e.target.value })
          }
        />

        <input
          type="datetime-local"
          className="styled-input"
          value={taskForm.deadline}
          onChange={(e) =>
            setTaskForm({ ...taskForm, deadline: e.target.value })
          }
        />

        <select
          className="styled-input"
          value={taskForm.category}
          onChange={(e) =>
            setTaskForm({ ...taskForm, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button className="primary-btn" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {/* ===== CATEGORY SECTIONS ===== */}
      {categories.map(category => (
        <div
          key={category._id}
          id={`category-${category._id}`}
          className="category-section"
        >
          <div className="category-header">
            <h2>{category.name}</h2>
            <button
              className="collapse-btn"
              onClick={() => toggleCategory(category._id)}
            >
              {collapsedCategories[category._id] ? "▸" : "▾"}
            </button>
          </div>

          {!collapsedCategories[category._id] &&
            tasks
              .filter(task => task.category?._id === category._id)
              .map(task => (
                <div
                  key={task._id}
                  className={`task-card ${
                    task.status === "success" ? "success-task" : ""
                  }`}
                >
                  {editingTaskId === task._id ? (
                    <div className="edit-section responsive-edit">
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
                        type="datetime-local"
                        className="styled-input"
                        value={editForm.deadline || ""}
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
                            {new Date(task.deadline).toLocaleString()}
                          </p>
                        )}

                        {/* PROGRESS BAR */}
                        <div className="progress-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${task.progress || 0}%` }}
                          />
                        </div>

                        <div className="progress-controls">
                          <button onClick={() => updateProgress(task._id, -10)}>–</button>
                          <span>{task.progress || 0}%</span>
                          <button onClick={() => updateProgress(task._id, 10)}>+</button>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
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
