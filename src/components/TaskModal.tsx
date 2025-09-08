import { useState, useEffect } from "react";
import { taskService } from "../services/api";
import { type Task } from "../types/Task";
import { formatDate } from "../utils/dateFormatter";
import PriorityDropdown from "./PriorityDropdown";
import { PRIORITY_MAP } from "../constants/priorities"; // Importe o PRIORITY_MAP
import FavoriteButton from "./FavoriteButton";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (taskId: string) => void;
}

function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [color, setColor] = useState(task.color || 0);
  const [isFavorite, setIsFavorite] = useState(task.favorite || false);
  const [isComplete, setIsComplete] = useState(task.complete || false);

  // Obter a prioridade atual para o header
  const currentPriority = PRIORITY_MAP[task.color || 0];

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
        {/* Header com Complete, Favorito e Fechar */}
        <div
          className="modal-header"
          style={{
            backgroundColor: currentPriority.bgColor,
            color: currentPriority.textColor,
          }}
        >
          <div className="modal-actions-top">
            <label className="modal-checkbox">
              <input
                type="checkbox"
                checked={isComplete}
                onChange={(e) => setIsComplete(e.target.checked)}
              />
            </label>

            <FavoriteButton
              isFavorite={isFavorite}
              onChange={setIsFavorite}
              size={32} // Aumentei de 24 para 32
              className="modal-favorite"
            />
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição detalhada..."
              />
            </div>

            <div className="form-group">
              <label>Prioridade:</label>
              <PriorityDropdown
                value={color}
                onChange={setColor}
                className="priority-dropdown-modal"
              />
            </div>

            <div className="modal-actions-bottom">
              <button type="submit" className="btn btn-primary">
                💾 Salvar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-delete"
              >
                🗑️ Excluir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
