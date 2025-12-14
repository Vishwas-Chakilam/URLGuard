import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { quizQuestions } from '../data/quizQuestions';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { supabase } from '../lib/supabaseClient';

const createPrng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
};

export default function Quiz() {
  const { user } = useAuth();
  const { awardQuizPoints } = useGamification();
  const [sessionSeed] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = useMemo(() => {
    const prng = createPrng(sessionSeed);
    const pool = [...quizQuestions];
    const picked = [];
    while (picked.length < 10 && pool.length > 0) {
      const index = Math.floor(prng() * pool.length);
      picked.push(pool.splice(index, 1)[0]);
    }
    return picked;
  }, [sessionSeed]);

useEffect(() => {
  setAnswers(Array(questions.length).fill(-1));
}, [questions]);

  const rawScore = answers.reduce(
    (total, answer, index) => total + (answer === questions[index].correctIndex ? 1 : 0),
    0
  );
  const score = submitted ? rawScore : 0;

  const submitQuiz = async () => {
    if (answers.includes(-1)) {
      toast.error('Please answer all questions.');
      return;
    }
    setSubmitted(true);
    if (user && supabase) {
      const { error } = await supabase.from('quiz_results').insert({
        user_id: user.id,
        score: rawScore,
        total: questions.length,
        answers,
      });
      if (error) {
        console.error('Quiz save error:', error);
        toast.error('Could not save quiz result. Check Supabase policies.');
        return;
      }
      await awardQuizPoints(rawScore);
    } else {
      toast('Sign in to save quiz progress and earn points.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Quiz</p>
        <h1 className="text-3xl font-semibold">Safety awareness challenge</h1>
        <p className="text-slate-500">Each session pulls 10 deterministic questions. Earn 2 points per correct answer.</p>
      </div>

      <div className="space-y-6">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Question {questionIndex + 1} / {questions.length}
            </p>
            <p className="text-lg font-semibold">{question.question}</p>
            <div className="grid gap-2">
              {question.choices.map((choice, choiceIndex) => {
                const isSelected = answers[questionIndex] === choiceIndex;
                const isCorrect = submitted && question.correctIndex === choiceIndex;
                const isIncorrect = submitted && isSelected && choiceIndex !== question.correctIndex;
                return (
                  <button
                    type="button"
                    key={choice}
                    className={`text-left px-4 py-3 rounded-2xl border ${
                      isCorrect
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                        : isIncorrect
                          ? 'border-red-300 bg-red-50 dark:bg-red-500/10'
                          : isSelected
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                            : 'border-slate-200 dark:border-slate-800'
                    }`}
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[questionIndex] = choiceIndex;
                        return next;
                      })
                    }
                    disabled={submitted}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="text-sm text-slate-500">
                Explanation: {question.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-2xl font-semibold">
          {submitted ? `You scored ${score}/${questions.length}` : 'Ready to submit your answers?'}
        </p>
        <div className="flex gap-3">
          {!submitted && (
            <button
              type="button"
              className="px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700"
              onClick={submitQuiz}
            >
              Submit quiz
            </button>
          )}
          {submitted && (
            <button
              type="button"
              className="px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700"
              onClick={() => window.location.reload()}
            >
              Start new session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

