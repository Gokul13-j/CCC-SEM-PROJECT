import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const emptyTask = { title: "", description: "", priority: "Medium", dueDate: "" };

export default function Dashboard() {
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [dashboard, setDashboard] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalDurationSeconds: 0
  });
  const navigate = useNavigate();

  const loadData = async () => {
    const [tasksRes, logsRes, dashboardRes] = await Promise.all([
      API.get("/tasks"),
      API.get("/timelogs"),
      API.get("/tasks/dashboard")
    ]);
    setTasks(tasksRes.data);
    setLogs(logsRes.data);
    setDashboard(dashboardRes.data);
  };

  useEffect(() => {
    loadData().catch(() => {
      localStorage.clear();
      navigate("/login");
    });
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    await API.post("/tasks", taskForm);
    setTaskForm(emptyTask);
    loadData();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    loadData();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    loadData();
  };

  const startTimer = async (taskId) => {
    await API.post("/timelogs/start", { taskId });
    loadData();
  };

  const stopTimer = async (taskId) => {
    await API.post("/timelogs/stop", { taskId });
    loadData();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h2 className="page-title">Task & Time Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="stats">
        <p className="stat-item">Total Tasks: {dashboard.totalTasks}</p>
        <p className="stat-item">Completed Tasks: {dashboard.completedTasks}</p>
        <p className="stat-item">Total Time (sec): {dashboard.totalDurationSeconds}</p>
      </div>

      <form className="task-form" onSubmit={createTask}>
        <h3>Create Task</h3>
        <input
          placeholder="Task title"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
        />
        <select
          value={taskForm.priority}
          onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="date"
          value={taskForm.dueDate}
          onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
        />
        <button type="submit">Create Task</button>
      </form>

      <h3 className="section-title">Tasks</h3>
      {tasks.length === 0 && (
        <div className="card empty">
          <p>No tasks yet. Create one task above, then Start/Stop timer buttons will appear.</p>
        </div>
      )}
      {tasks.map((task) => (
        <div key={task._id} className="card">
          <p>
            <strong>{task.title}</strong> ({task.priority})
          </p>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</p>
          <div className="row">
            <button className="btn" onClick={() => updateStatus(task._id, "Pending")}>Pending</button>
            <button className="btn" onClick={() => updateStatus(task._id, "In Progress")}>In Progress</button>
            <button className="btn" onClick={() => updateStatus(task._id, "Completed")}>Completed</button>
            <button className="btn btn-start" onClick={() => startTimer(task._id)}>Start</button>
            <button className="btn btn-stop" onClick={() => stopTimer(task._id)}>Stop</button>
            <button className="btn btn-delete" onClick={() => deleteTask(task._id)}>Delete</button>
          </div>
        </div>
      ))}

      <h3 className="section-title">Time Logs</h3>
      {logs.length === 0 && (
        <div className="card empty">
          <p>No time logs yet. Click Start on any task, wait a few seconds, then click Stop.</p>
        </div>
      )}
      {logs.map((log) => (
        <div key={log._id} className="card">
          <p>Task: {log.taskId?.title || "Deleted Task"}</p>
          <p>Start: {new Date(log.startTime).toLocaleString()}</p>
          <p>End: {log.endTime ? new Date(log.endTime).toLocaleString() : "Running..."}</p>
          <p>Duration (sec): {log.duration}</p>
        </div>
      ))}
    </div>
  );
}
