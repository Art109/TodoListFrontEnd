import { type Task } from "../types/Task";

interface TaskListProps {
  tasks: Task[];
  onToggleFavorite: (taskId: string, currentFavorite: boolean) => void;
  onToggleComplete: (taskId: string, currentComplete: boolean) => void;
  onOpenModal: (task: Task) => void;
}

const colorMap: Record<number, string> = {
  0: "#cccccc", // No Color
  1: "#0000ff", // Blue
  2: "#00ff00", // Green
  3: "#ffff00", // Yellow
  4: "#ffa500", // Orange
  5: "#ff0000", // Red
};

function TaskList({
  tasks,
  onToggleFavorite,
  onToggleComplete,
  onOpenModal,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="task-item"
          style={{
            backgroundColor: colorMap[task.color || 0],
            borderLeft: `5px solid ${colorMap[task.color || 0]}`,
          }}
        >
          <h3>{task.name}</h3>
          <p>Color: {task.color}</p>
          <button
            onClick={() => onToggleFavorite?.(task._id, task.favorite || false)}
            className="favorite-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5em",
            }}
          >
            {task.favorite ? "⭐" : "☆"}
          </button>

          <button
            onClick={() => onOpenModal(task)}
            style={{ marginLeft: "10px" }}
          >
            📝 Editar
          </button>

          <p>Data: {task.startDate}</p>
          <button
            onClick={() => onToggleComplete(task._id, task.complete || false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2em",
              marginLeft: "10px",
            }}
            title={task.complete ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.complete ? "✅" : "⚪"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
