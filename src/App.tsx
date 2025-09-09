import { useEffect, useState } from "react";
import { type Task } from "./types/Task";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import TaskFilters from "./components/TaskFilters";
import { taskService } from "./services/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentFilters, setCurrentFilters] = useState<{
    favorite?: boolean;
    color?: number;
  }>(() => {
    const savedFilters = localStorage.getItem("taskFilters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  });

  const loadTasks = async (filters?: {
    favorite?: boolean;
    color?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getAllTasks(filters);
      setTasks(tasksData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      console.error("Error loading tasks:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(currentFilters));
    loadTasks(currentFilters);
  }, [currentFilters]);

  const handleFilter = (filters: { favorite?: boolean; color?: number }) => {
    setCurrentFilters(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
  };

  const handleTaskCreated = async (newTaskData: Omit<Task, "_id" | "__v">) => {
    try {
      setLoading(true);
      await taskService.createTask(newTaskData);
      await loadTasks(currentFilters);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create task";
      setError(errorMessage);
      console.error("Error creating task:", errorMessage);
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (
    taskId: string,
    newFavoriteValue: boolean
  ) => {
    try {
      await taskService.updateTask(taskId, {
        favorite: newFavoriteValue,
      });
      await loadTasks(currentFilters);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      setError(errorMessage);
      console.error("Error updating task:", errorMessage);
    }
  };

  const handleToggleComplete = async (
    taskId: string,
    currentComplete: boolean
  ) => {
    try {
      await taskService.updateTask(taskId, {
        complete: !currentComplete,
      });
      await loadTasks(currentFilters);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      setError(errorMessage);
      console.error("Error updating task:", errorMessage);
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
      await loadTasks(currentFilters);
      handleCloseModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete task";
      setError(errorMessage);
      console.error("Error deleting task:", errorMessage);
    }
  };

  const handleRetry = () => {
    setError(null);
    loadTasks(currentFilters);
  };

  if (loading) return <div className="loading">Loading Tasks</div>;
  if (error)
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <button onClick={handleRetry} className="retry-btn">
          Tentar Novamente
        </button>
      </div>
    );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 Painel de Tarefas</h1>
        <p>Organize suas atividades diárias</p>
      </header>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <TaskFilters
        onFilter={handleFilter}
        onClear={handleClearFilters}
        currentFilters={currentFilters}
      />

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
          onUpdate={() => loadTasks(currentFilters)}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default App;
