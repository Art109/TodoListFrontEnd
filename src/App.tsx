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
      setError(error instanceof Error ? error.message : "An error occurred");
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
      setError(
        error instanceof Error ? error.message : "Failed to create task"
      );
    }
  };

  const handleToggleFavorite = async (
    taskId: string,
    newFavoriteValue: boolean // Mude o nome do parâmetro
  ) => {
    try {
      await taskService.updateTask(taskId, {
        favorite: newFavoriteValue, // Use o novo valor diretamente
      });
      await loadTasks(currentFilters);
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
      await loadTasks(currentFilters);
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
      await loadTasks(currentFilters); // Recarrega a lista após deletar
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
