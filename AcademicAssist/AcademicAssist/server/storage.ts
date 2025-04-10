import { users, type User, type InsertUser, questions, type Question, type InsertQuestion, type UpdateQuestion } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByUserId(userId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, data: UpdateQuestion): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;
  deleteAllQuestions(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  currentUserId: number;
  currentQuestionId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByUserId(userId: number): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(question => question.userId === userId)
      .sort((a, b) => {
        // Sort by createdAt in descending order (newest first)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const now = new Date();
    const question: Question = {
      ...insertQuestion,
      id,
      createdAt: now,
      answer: null,
      error: null
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestion(id: number, data: UpdateQuestion): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;

    const updatedQuestion: Question = {
      ...question,
      ...data
    };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    return this.questions.delete(id);
  }

  async deleteAllQuestions(userId: number): Promise<boolean> {
    const questionIds = Array.from(this.questions.values())
      .filter(question => question.userId === userId)
      .map(question => question.id);
    
    for (const id of questionIds) {
      this.questions.delete(id);
    }
    
    return true;
  }
}

export const storage = new MemStorage();
