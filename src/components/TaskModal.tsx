import { useState, useEffect } from "react";
import { taskService } from "../services/api";
import { type Task } from "../types/Task";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (taskId: string) => void;
}

const colorOptions = [
  { value: 0, color: "#cccccc", label: "No Color" },
  { value: 1, color: "#0000ff", label: "Blue" },
  { value: 2, color: "#00ff00", label: "Green" },
  { value: 3, color: "#ffff00", label: "Yellow" },
  { value: 4, color: "#ffa500", label: "Orange" },
  { value: 5, color: "#ff0000", label: "Red" },
];

function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [color, setColor] = useState(task.color || 0);
  const [isFavorite, setIsFavorite] = useState(task.favorite || false);
  const [isComplete, setIsComplete] = useState(task.complete || false);

  // Atualiza os estados quando a task muda
  useEffect(() => {
    setName(task.name);
    setDescription(task.description || "");
    setColor(task.color || 0);
    setIsFavorite(task.favorite || false);
    setIsComplete(task.complete || false);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.updateTask(task._id, {
        name,
        description,
        color,
        favorite: isFavorite,
        complete: isComplete,
      });
      onUpdate(); // Recarrega a lista
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await onDelete(task._id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Edit Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Color:</label>
            <div className="color-picker">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`color-option ${
                    color === option.value ? "selected" : ""
                  }`}
                  style={{ backgroundColor: option.color }}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
              />
              ⭐ Favorite
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isComplete}
                onChange={(e) => setIsComplete(e.target.checked)}
              />
              ✅ Complete
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleDelete} className="delete-btn">
              🗑️ Delete Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
