import { type Task } from "../types/Task";
import { formatDate } from "../utils/dateFormatter";
import { PRIORITY_MAP } from "../constants/priorities";
import FavoriteButton from "./FavoriteButton";

interface TaskListProps {
  tasks: Task[];
  onToggleFavorite: (taskId: string, currentFavorite: boolean) => void;
  onToggleComplete: (taskId: string, currentComplete: boolean) => void;
  onOpenModal: (task: Task) => void;
}

// Não precisa mais disso, já que vamos usar PRIORITY_MAP diretamente
// const colorMap = PRIORITY_MAP;

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
      {tasks.map((task) => {
        const priority = PRIORITY_MAP[task.color || 0];

        return (
          <div
            key={task._id}
            className={`task-item ${task.complete ? "complete" : ""}`}
            style={{
              backgroundColor: priority.bgColor,
              borderLeftColor: priority.color,
            }}
            onClick={() => onOpenModal(task)}
          >
            {/* Checkbox de completo */}
            <input
              type="checkbox"
              checked={task.complete || false}
              onChange={(e) => {
                console.log("Checkbox clicked - should not open modal");
                e.stopPropagation();
                onToggleComplete(task._id, task.complete || false);
              }}
              onClick={(e) => {
                console.log("Checkbox onClick - stopping propagation");
                e.stopPropagation();
              }}
              className="task-checkbox"
            />

            {/* Nome da task */}
            <h3 className="task-name">{task.name}</h3>

            <FavoriteButton
              isFavorite={task.favorite || false}
              onChange={(isFavorite) => onToggleFavorite(task._id, isFavorite)}
              size={28}
              className="task-favorite"
            />

            {/* Data formatada */}
            <span className="task-date">{formatDate(task.startDate)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;
