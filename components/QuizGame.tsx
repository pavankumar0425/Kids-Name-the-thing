
import React, { useState, useEffect, useCallback } from 'react';
import { Category, Question } from '../types';
import { generateQuestionImage } from '../services/geminiService';

interface QuizGameProps {
  questions: Question[];
  onFinish: (score: number) => void;
  onBack: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onFinish, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];

  const loadQuestionImage = useCallback(async () => {
    if (!currentQuestion) return;
    setImageLoading(true);
    setCurrentImage(null);
    const img = await generateQuestionImage(currentQuestion.imageDescription);
    setCurrentImage(img);
    setImageLoading(false);
  }, [currentQuestion]);

  useEffect(() => {
    loadQuestionImage();
  }, [loadQuestionImage]);

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
    } else {
      onFinish(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="bg-white/80 hover:bg-white px-4 py-2 rounded-full transition-all text-blue-600 font-bold shadow-sm"
        >
          ← Home
        </button>
        <div className="flex gap-2">
          <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold shadow-sm">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="bg-green-400 text-green-900 px-4 py-1 rounded-full font-bold shadow-sm">
            ⭐ {score}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border-4 border-white overflow-hidden">
        <div className="mb-8 flex flex-col items-center">
          {/* Passage Section for Reading/Comprehension */}
          {currentQuestion.passage && (
            <div className="w-full bg-blue-50 p-6 rounded-2xl mb-8 border-2 border-blue-100 italic text-blue-900 text-lg md:text-xl text-center leading-relaxed">
              "{currentQuestion.passage}"
            </div>
          )}

          <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center relative border-4 border-blue-100 shadow-inner">
            {imageLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-400 font-bold animate-pulse text-sm">Sketching...</p>
              </div>
            ) : currentImage ? (
              <img src={currentImage} alt="Guessing time!" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-6xl grayscale opacity-20">🖼️</div>
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-center mt-8 text-slate-800 leading-tight">
            {currentQuestion.prompt}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            let btnClass = "relative overflow-hidden p-5 rounded-2xl text-lg font-bold transition-all border-b-4 text-left ";
            
            if (showFeedback) {
              if (isCorrect) btnClass += "bg-green-500 border-green-700 text-white scale-[1.02] z-10 shadow-lg";
              else if (isSelected) btnClass += "bg-red-500 border-red-700 text-white opacity-90";
              else btnClass += "bg-gray-100 border-gray-300 text-gray-400 opacity-40";
            } else {
              btnClass += "bg-white border-blue-200 text-blue-900 hover:bg-blue-50 hover:border-blue-400 hover:-translate-y-1 active:translate-y-0 shadow-sm";
            }

            return (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => handleAnswer(option)}
                className={btnClass}
              >
                <span className="inline-block w-10 h-10 rounded-xl bg-slate-100 mr-3 text-center leading-10 text-slate-500 group-hover:bg-blue-200 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border-4 border-yellow-200 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">
                {selectedAnswer === currentQuestion.correctAnswer ? "🌈" : "💡"}
              </span>
              <div>
                <h4 className="text-yellow-900 font-bold text-xl">
                  {selectedAnswer === currentQuestion.correctAnswer ? "Fantastic!" : "Almost! The answer is: " + currentQuestion.correctAnswer}
                </h4>
                <p className="text-yellow-800 font-medium">Fun Fact Time!</p>
              </div>
            </div>
            <p className="text-yellow-900 bg-white/50 p-4 rounded-xl border border-yellow-100 shadow-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
            >
              {currentIndex + 1 === questions.length ? "Finish Adventure! 🏁" : "Next Mission! 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
