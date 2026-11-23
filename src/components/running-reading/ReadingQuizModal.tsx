import React, { useState } from 'react';
import { ReadingMaterial } from '../../types';
import { useArena } from '../../context/ArenaContext';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  material: ReadingMaterial;
  readingDurationSeconds: number;
  calculatedWpm: number;
  onClose: () => void;
  onRetry: () => void;
}

export const ReadingQuizModal: React.FC<Props> = ({
  material,
  readingDurationSeconds,
  calculatedWpm,
  onClose,
  onRetry
}) => {
  const { awardXp, completeDailyChallenge } = useArena();
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    soundService.playClick();
  };

  const handleTextAnswer = (questionId: string, text: string) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    material.questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined && ans === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / material.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    // Calculate XP: 20 base XP + 15 bonus if score >= 80%
    const earnedXp = 20 + (finalScore >= 80 ? 15 : 5);
    awardXp(earnedXp, `Completed Running Reading: "${material.title}" (${finalScore}% score)`);

    // Check daily challenge 3 (Reading sprint)
    if (finalScore >= 80) {
      completeDailyChallenge('dc-3');
    }
  };

  const allAnswered = material.questions.every(q => userAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-float border border-slate-200 animate-slide-up my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Comprehension Challenge
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{material.title}</h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Reading Speed</div>
            <div className="text-base font-bold font-mono text-indigo-600">{calculatedWpm} WPM</div>
          </div>
        </div>

        {/* Speed Note per requirements: Do not falsely claim WPM as absolute standard reading measure */}
        <div className="mt-3 p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-800">
          <span className="font-semibold">Note:</span> Speed is estimated based on completed reading time ({readingDurationSeconds}s) and word count ({material.wordCount} words).
        </div>

        {/* Questions list */}
        <div className="mt-6 space-y-6">
          {material.questions.map((q, qIndex) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = submitted && userAnswer === q.correctAnswer;
            const isWrong = submitted && userAnswer !== q.correctAnswer;

            return (
              <div 
                key={q.id} 
                className={`p-4 rounded-xl border transition-all ${
                  submitted 
                    ? isCorrect 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-sm text-slate-900">
                    <span className="text-indigo-600 mr-2">{qIndex + 1}.</span>
                    {q.question}
                  </div>
                  {submitted && (
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  )}
                </div>

                {/* Multiple choice / True-False */}
                {q.options && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = userAnswer === optIndex;
                      const isActualCorrect = submitted && q.correctAnswer === optIndex;

                      return (
                        <button
                          key={optIndex}
                          disabled={submitted}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`text-left text-xs p-3 rounded-lg border font-medium transition-all ${
                            isSelected
                              ? submitted
                                ? isCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-rose-600 text-white border-rose-600'
                                : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : isActualCorrect
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Explanation on submit */}
                {submitted && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Result Summary */}
        {submitted && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-indigo-900 font-medium">Score Achieved</div>
                <div className="text-lg font-extrabold text-indigo-700">{score}% Comprehension</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Earned XP</div>
              <div className="text-base font-extrabold text-emerald-600">+{20 + (score >= 80 ? 15 : 5)} XP</div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Read Again</span>
          </button>

          {!submitted ? (
            <button
              disabled={!allAnswered}
              onClick={handleSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                allAnswered
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Submit Answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              Finish & Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
