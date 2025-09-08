import axios from "axios";
import { type Task } from "../types/Task";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

const handleError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error);
  const message =
    error.response?.data?.error || error.message || "Failed to fetch data";
  throw new Error(message);
};

export const taskService = {
  // GET ALL (filtered)
  getAllTasks: async (filters?: {
    favorite?: boolean;
    color?: number;
  }): Promise<Task[]> => {
    try {
      const response = await api.get("/tasks", { params: filters });
      return response.data;
    } catch (error) {
      return handleError(error, "getAllTasks");
    }
  },

  // CREATE task
  createTask: async (taskData: Omit<Task, "_id" | "__v">): Promise<Task> => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      return handleError(error, "createTask");
    }
  },

  // UPDATE task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      return handleError(error, "updateTask");
    }
  },

  // DELETE task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      handleError(error, "deleteTask");
      throw error;
    }
  },
};
