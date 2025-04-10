import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAnswer } from "./openai";
import { insertQuestionSchema, updateQuestionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Route to ask a question and get an answer
  app.post("/api/questions", async (req, res) => {
    try {
      // Validate question data
      const validatedData = insertQuestionSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      // Create question in storage (userId is optional for now)
      const question = await storage.createQuestion({
        question: validatedData.data.question,
        userId: validatedData.data.userId || null
      });

      try {
        // Generate answer using OpenAI
        const { answer, error } = await generateAnswer(validatedData.data.question);
        
        // Update question with answer or error
        const updatedQuestion = await storage.updateQuestion(question.id, {
          answer: answer,
          error: error || null
        });
        
        return res.status(200).json(updatedQuestion);
      } catch (error: any) {
        // Update question with error
        const updatedQuestion = await storage.updateQuestion(question.id, {
          answer: null,
          error: error.message || "Failed to generate answer"
        });
        
        return res.status(500).json(updatedQuestion);
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Route to regenerate an answer for a question
  app.post("/api/questions/:id/regenerate", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      
      // Get the question
      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      try {
        // Generate new answer using OpenAI
        const { answer, error } = await generateAnswer(question.question);
        
        // Update question with new answer or error
        const updatedQuestion = await storage.updateQuestion(questionId, {
          answer: answer,
          error: error || null
        });
        
        return res.status(200).json(updatedQuestion);
      } catch (error: any) {
        // Update question with error
        const updatedQuestion = await storage.updateQuestion(questionId, {
          answer: null,
          error: error.message || "Failed to regenerate answer"
        });
        
        return res.status(500).json(updatedQuestion);
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Route to get a specific question by ID
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getQuestion(questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      return res.status(200).json(question);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Route to get questions by user ID
  app.get("/api/users/:userId/questions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const questions = await storage.getQuestionsByUserId(userId);
      
      return res.status(200).json(questions);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Route to delete a specific question
  app.delete("/api/questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const success = await storage.deleteQuestion(questionId);
      
      if (!success) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      return res.status(200).json({ message: "Question deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Route to delete all questions for a user
  app.delete("/api/users/:userId/questions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.deleteAllQuestions(userId);
      
      return res.status(200).json({ message: "All questions deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
