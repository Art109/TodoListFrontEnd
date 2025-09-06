import axios from "axios";
import { type Task } from "../types/Task";

const API_URL = "http://localhost:3000";

const handleError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error);
  const message =
    error.response?.data?.error || error.message || "Failed to fetch data";
  throw new Error(message);
};

export const taskService = {
  // GET ALL (filtered)
  getAllTasks: async (favorite?: boolean, color?: number): Promise<Task[]> => {
    try {
      const params = new URLSearchParams();
      if (favorite !== undefined)
        params.append("favorite", favorite.toString());
      if (color !== undefined) params.append("color", color.toString());

      const response = await axios.get(`${API_URL}/tasks?${params}`);
      return response.data;
    } catch (error) {
      return handleError(error, "getAllTasks");
    }
  },

  // CREATE task
  createTask: async (taskData: Omit<Task, "_id" | "__v">): Promise<Task> => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      return handleError(error, "createTask");
    }
  },

  // UPDATE task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      return handleError(error, "updateTask");
    }
  },

  //DELETE TASK
  deleteTask: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (error) {
      return handleError(error, "deleteTask");
    }
  },
};
