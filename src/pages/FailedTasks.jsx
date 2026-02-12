import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function FailedTasks() {
  const navigate = useNavigate();
  const [failedTasks, setFailedTasks] = useState([]);

  const fetchFailed = async () => {
    const { data } = await axios.get("/tasks");
    setFailedTasks(data.filter(t => t.status === "failure"));
  };

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchFailed();
  };

  useEffect(() => {
    fetchFailed();
  }, []);

  return (
    <div className="dashboard">
      <h1>Failed Tasks</h1>

      {failedTasks.map(task => (
        <div key={task._id} className="task-card failed-task">
          <div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>

          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}

      <button className="floating-btn" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default FailedTasks;
