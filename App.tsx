
import React, { useState } from 'react';
import { Category, Question } from './types';
import { generateQuizQuestions } from './services/geminiService';
import CategoryCard from './components/CategoryCard';
import QuizGame from './components/QuizGame';

const CATEGORIES = [
  { id: Category.ANIMALS, icon: '🦁', color: 'bg-orange-500' },
  { id: Category.RAMAYANA, icon: '🏹', color: 'bg-amber-600' },
  { id: Category.MAHABHARATA, icon: '⚔️', color: 'bg-rose-600' },
  { id: Category.INDIAN_MYTH, icon: '🕉️', color: 'bg-orange-600' },
  { id: Category.COMPREHENSION, icon: '📖', color: 'bg-blue-600' },
  { id: Category.SCIENCE, icon: '🧪', color: 'bg-cyan-500' },
  { id: Category.MATH, icon: '➕', color: 'bg-pink-500' },
  { id: Category.OTHER_MYTH, icon: '⚡', color: 'bg-purple-600' },
  { id: Category.SOCIAL, icon: '🏘️', color: 'bg-emerald-600' },
  { id: Category.FLAGS, icon: '🚩', color: 'bg-red-500' },
  { id: Category.BIRDS, icon: '🦜', color: 'bg-yellow-500' },
  { id: Category.COUNTRIES, icon: '🌍', color: 'bg-green-500' },
];

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const startQuiz = async (category: Category) => {
    setLoading(true);
    setCurrentCategory(category);
    const data = await generateQuizQuestions(category);
    setQuestions(data);
    setLoading(false);
  };

  const reset = () => {
    setCurrentCategory(null);
    setQuestions([]);
    setFinalScore(null);
  };

  if (finalScore !== null) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full border-b-[12px] border-blue-200">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Quiz Complete!</h1>
          <div className="space-y-2 mb-8">
            <p className="text-6xl font-black text-blue-600">{finalScore}</p>
            <p className="text-xl text-blue-400 font-bold uppercase tracking-widest">Points Won!</p>
          </div>
          <p className="text-blue-700 mb-8 italic">
            You're becoming a real expert in {currentCategory}!
          </p>
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-xl"
          >
            Play Again! 🔄
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-8 text-center max-w-sm">
          <div className="relative">
            <div className="w-32 h-32 border-[12px] border-blue-100 rounded-full"></div>
            <div className="w-32 h-32 border-[12px] border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
            <div className="absolute inset-0 flex items-center justify-center text-5xl animate-pulse">
              ✨
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Summoning Wisdom...</h2>
            <p className="text-blue-500 font-bold italic">Gathering questions for {currentCategory}!</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentCategory && questions.length > 0) {
    return (
      <div className="min-h-screen bg-blue-50">
        <QuizGame 
          questions={questions} 
          onFinish={(score) => setFinalScore(score)}
          onBack={reset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <header className="pt-16 pb-12 px-6 text-center bg-white shadow-xl mb-12 rounded-b-[60px] border-b-8 border-blue-100">
        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
          Holiday Edition
        </div>
        <h1 className="text-5xl md:text-7xl text-blue-600 mb-4 drop-shadow-sm font-black">
          KidQuiz Adventure 🚀
        </h1>
        <p className="text-blue-400 font-bold text-xl md:text-2xl max-w-2xl mx-auto">
          Choose a path and start your journey through myths, legends, and logic!
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">1</span>
              Select a Topic
            </h2>
            <span className="hidden md:block text-slate-400 font-bold uppercase tracking-wider text-sm">
              Over 5,000 Possibilities!
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                category={cat.id} 
                icon={cat.icon} 
                color={cat.color}
                onSelect={startQuiz}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-400 rounded-[2.5rem] p-10 shadow-xl flex flex-col items-center md:items-start text-center md:text-left gap-6 border-b-8 border-yellow-500">
            <div className="text-7xl">🕉️</div>
            <div>
              <h3 className="text-3xl font-black text-yellow-900 mb-2">Mythology Hub</h3>
              <p className="text-yellow-800 text-lg font-bold">
                Learn about Hanuman, Ganesha, Thor, and more! Epic stories for little heroes.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl flex flex-col items-center md:items-start text-center md:text-left gap-6 border-b-8 border-slate-200">
            <div className="text-7xl">🧠</div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">Reading Power</h3>
              <p className="text-slate-500 text-lg font-bold">
                Boost your brain with stories and comprehension puzzles. Every answer makes you smarter!
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-slate-400 font-bold pb-12 flex flex-col items-center gap-4">
        <div className="w-16 h-1 bg-slate-200 rounded-full"></div>
        <p>Created for 3rd Grade Legends Everywhere ✨</p>
      </footer>
    </div>
  );
};

export default App;
