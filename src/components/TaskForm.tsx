import { useState } from "react";
import { type Task } from "../types/Task";
import PriorityDropdown from "./PriorityDropdown";
import FavoriteButton from "./FavoriteButton";

interface TaskFormProps {
  onTaskCreated: (task: Omit<Task, "_id" | "__v">) => void;
}

function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [name, setName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTaskData: Omit<Task, "_id" | "__v"> = {
      name: name.trim(),
      color: selectedColor,
      favorite: isFavorite,
      description: "",
      complete: false,
      startDate: new Date(),
      endDate: null,
    };

    onTaskCreated(newTaskData);
    setName("");
    setIsFavorite(false);
    setSelectedColor(0);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-horizontal">
      {/* Grupo do input + favorito */}
      <div className="form-group-horizontal input-with-favorite">
        <input
          type="text"
          placeholder="Nome da Tarefa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="task-input"
        />
        <FavoriteButton
          isFavorite={isFavorite}
          onChange={setIsFavorite}
          size={28}
          className="favorite-in-input"
        />
      </div>

      {/* Dropdown de prioridades */}
      <div className="form-group-horizontal">
        <PriorityDropdown
          value={selectedColor}
          onChange={setSelectedColor}
          className="priority-dropdown-form"
        />
      </div>

      {/* Botão de submit */}
      <div className="form-group-horizontal">
        <button type="submit" className="add-btn">
          Criar
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
