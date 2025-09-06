import { useState } from "react";
import { type Task } from "../types/Task";

interface TaskFormProps {
  onTaskCreated: (task: Omit<Task, "_id" | "__v">) => void;
}

const colorOptions = [
  { value: 0, color: "#cccccc", label: "No Color" },
  { value: 1, color: "#0000ff", label: "Blue" },
  { value: 2, color: "#00ff00", label: "Green" },
  { value: 3, color: "#ffff00", label: "Yellow" },
  { value: 4, color: "#ffa500", label: "Orange" },
  { value: 5, color: "#ff0000", label: "Red" },
];

function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [name, setName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTaskData: Omit<Task, "_id" | "__v"> = {
      name,
      color: selectedColor,
      favorite: isFavorite,
    };

    onTaskCreated(newTaskData);
    setName("");
    setIsFavorite(false);
    setSelectedColor(0);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <label>Color:</label>
        <div className="color-picker">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`color-option ${
                selectedColor === option.value ? "selected" : ""
              }`}
              style={{ backgroundColor: option.color }}
              onClick={() => setSelectedColor(option.value)}
              title={option.label}
            />
          ))}
        </div>
      </div>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
