import type { QuizQuestion } from '../data/quizQuestions';

export type QuizSession = {
  id: string;
  questions: QuizQuestion[];
  createdAt: number;
};

export type QuizResult = {
  score: number;
  total: number;
  answers: number[];
};

