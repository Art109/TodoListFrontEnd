import { useEffect, useState } from "react";
import { type Task } from "./types/Task";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import { taskService } from "./services/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      setloading(true);
      setError(null);
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error ocurred");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskCreated = async (newTaskData: Omit<Task, "_id" | "__v">) => {
    try {
      await taskService.createTask(newTaskData);
      await loadTasks();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create task"
      );
    }
  };

  const handleToggleFavorite = async (
    taskId: string,
    currentFavorite: boolean
  ) => {
    try {
      // 1. Atualiza no backend
      await taskService.updateTask(taskId, {
        favorite: !currentFavorite,
      });

      // 2. Recarrega TODAS as tasks para garantir ordenação correta
      await loadTasks();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  };

  const handleToggleComplete = async (
    taskId: string,
    currentComplete: boolean
  ) => {
    try {
      // Agora envia APENAS o campo complete - o backend cuida do endDate!
      await taskService.updateTask(taskId, {
        complete: !currentComplete,
      });
      await loadTasks();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  };

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      await loadTasks(); // Recarrega a lista após deletar
      handleCloseModal(); // Fecha o modal se estiver aberto
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  };

  if (loading) return <div className="loading">Loading Tasks</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <header>
        <h1>Minha To-Do List</h1>
      </header>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <TaskList
        tasks={tasks}
        onToggleFavorite={handleToggleFavorite}
        onToggleComplete={handleToggleComplete}
        onOpenModal={handleOpenModal}
      />

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onUpdate={loadTasks} // Recarrega a lista após atualizar
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default App;
