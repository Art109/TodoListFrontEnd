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

function TaskList({
  tasks,
  onToggleFavorite,
  onToggleComplete,
  onOpenModal,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  const handleCheckboxClick = (
    e: React.MouseEvent<HTMLInputElement>,
    taskId: string,
    currentComplete: boolean
  ) => {
    e.stopPropagation();
    onToggleComplete(taskId, currentComplete);
  };

  const handleFavoriteClick = (taskId: string, isFavorite: boolean) => {
    onToggleFavorite(taskId, isFavorite);
  };

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
              onChange={() =>
                onToggleComplete(task._id, task.complete || false)
              }
              onClick={(e) =>
                handleCheckboxClick(e, task._id, task.complete || false)
              }
              className="task-checkbox"
            />

            {/* Nome da task */}
            <h3 className="task-name">{task.name}</h3>

            {/* Botão favorito com prevenção de propagação */}
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteButton
                isFavorite={task.favorite || false}
                onChange={(isFavorite) =>
                  handleFavoriteClick(task._id, isFavorite)
                }
                size={28}
                className="task-favorite"
              />
            </div>

            {/* Data formatada */}
            <span className="task-date">{formatDate(task.startDate)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;
