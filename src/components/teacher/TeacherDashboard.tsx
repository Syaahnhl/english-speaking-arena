import React, { useState } from 'react';
import { useArena } from '../../context/ArenaContext';
import { storageService } from '../../services/storageService';
import { StudentSubmission, Classroom, SpeakingCard, ReadingMaterial, ProficiencyLevel } from '../../types';
import { WEEKLY_LEADERBOARD } from '../../data/seedUsersData';
import { soundService } from '../../services/soundService';
import { 
  GraduationCap, 
  Users, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  Send, 
  Award, 
  BookOpen, 
  Layers, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { addToast } = useArena();
  const [activeTab, setActiveTab] = useState<'roster' | 'grading' | 'create-card' | 'create-reading' | 'classes'>('roster');
  
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(storageService.getSubmissions());
  const [classrooms, setClassrooms] = useState<Classroom[]>(storageService.getClassrooms());
  
  // Grading Modal / State
  const [gradingSub, setGradingSub] = useState<StudentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Well structured arguments and strong vocal confidence!');

  // Form: Create Speaking Card
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardLevel, setNewCardLevel] = useState<ProficiencyLevel>('intermediate');
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardVocab, setNewCardVocab] = useState('');
  const [newCardDuration, setNewCardDuration] = useState(90);

  // Form: Create Classroom
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');

  const handleSaveGrade = () => {
    if (!gradingSub) return;
    storageService.gradeSubmission(gradingSub.id, gradeScore, gradeFeedback);
    setSubmissions(storageService.getSubmissions());
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Submission Graded',
      message: `Score ${gradeScore}/100 and feedback sent to ${gradingSub.studentName}.`
    });
    setGradingSub(null);
  };

  const handleCreateSpeakingCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle || !newCardQuestion) return;

    const vocabArray = newCardVocab.split(',').map(v => v.trim()).filter(Boolean);
    const card: SpeakingCard = {
      id: `custom-card-${Date.now()}`,
      title: newCardTitle,
      level: newCardLevel,
      category: 'opinion',
      question: newCardQuestion,
      estimatedDuration: newCardDuration,
      vocabularySuggestions: vocabArray.length > 0 ? vocabArray : ['Articulate', 'Perspective', 'Conclusion'],
      sentenceStarters: ['In my point of view...', 'Furthermore...', 'To summarize...'],
      hints: ['Maintain eye contact and clear pacing']
    };

    storageService.addSpeakingCard(card);
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Speaking Card Published',
      message: `"${newCardTitle}" is now live in the student Speaking Cards deck!`
    });

    setNewCardTitle('');
    setNewCardQuestion('');
    setNewCardVocab('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const code = `${newClassName.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCls: Classroom = {
      id: `cls-${Date.now()}`,
      name: newClassName,
      code,
      teacherId: 'usr-teacher-01',
      studentCount: 1,
      description: newClassDesc || 'Active English speaking cohort.'
    };

    storageService.addClassroom(newCls);
    setClassrooms(storageService.getClassrooms());
    soundService.playSuccess();
    addToast({
      type: 'success',
      title: 'Classroom Created',
      message: `Classroom "${newClassName}" registered with invite code: ${code}`
    });

    setNewClassName('');
    setNewClassDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher & Curriculum Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom & Student Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Monitor student speech performance, grade recorded submissions, configure custom Speaking Cards, and manage classroom competitions.
          </p>
        </div>

        {/* Teacher Navigation Pills */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {[
            { id: 'roster', label: 'Students Roster', icon: Users },
            { id: 'grading', label: `Review Tasks (${submissions.filter(s => s.status === 'pending').length})`, icon: FileText },
            { id: 'create-card', label: '+ Create Card', icon: Layers },
            { id: 'classes', label: 'Classes', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  soundService.playClick();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. STUDENT ROSTER TAB */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Enrolled Students Overview</h3>
              <p className="text-xs text-slate-500">Live progress metrics for Class 10-A</p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold">{WEEKLY_LEADERBOARD.length} Students</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Current Level</th>
                  <th className="py-3 px-3">XP Earned</th>
                  <th className="py-3 px-3">Daily Streak</th>
                  <th className="py-3 px-3">Completed Activities</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WEEKLY_LEADERBOARD.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 block">{st.name}</span>
                          <span className="text-[10px] text-slate-400">@{st.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                        {st.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">{st.xp} XP</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-600">{st.streak} Days</td>
                    <td className="py-3 px-3 text-slate-600">{st.completedChallenges} tasks</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Active Today
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUBMISSION REVIEW & GRADING TAB */}
      {activeTab === 'grading' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Student Speaking Submissions</h3>
              <p className="text-xs text-slate-500">
                Listen to recorded student speaking responses or roleplays, provide feedback, and assign grades.
              </p>
            </div>

            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">{sub.studentName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {sub.activityType}
                      </span>
                      <span className="text-xs text-slate-400">• {sub.submittedAt}</span>
                    </div>

                    <h4 className="font-semibold text-xs text-slate-700">{sub.assignmentTitle}</h4>
                    <p className="text-xs text-slate-600 mt-1 italic bg-white p-2.5 rounded-xl border border-slate-100">
                      "{sub.transcriptOrNotes}"
                    </p>

                    {sub.feedback && (
                      <div className="mt-2 text-xs text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                        <strong>Teacher Feedback:</strong> {sub.feedback}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {sub.status === 'graded' ? (
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade</span>
                        <span className="text-base font-black text-emerald-600 font-mono">{sub.score}/100</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setGradingSub(sub);
                          setGradeScore(90);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
                      >
                        Grade Submission
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Modal */}
          {gradingSub && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-float border border-slate-200 animate-slide-up space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Grade Submission: {gradingSub.studentName}
                  </h3>
                  <button
                    onClick={() => setGradingSub(null)}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <strong>Assignment:</strong> {gradingSub.assignmentTitle}
                  <p className="mt-1 italic">"{gradingSub.transcriptOrNotes}"</p>
                </div>

                {/* Score Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Performance Score:</span>
                    <span className="text-purple-700 font-mono text-base font-black">{gradeScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Feedback textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feedback to Student:</label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setGradingSub(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleSaveGrade}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  >
                    Save & Submit Grade
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CREATE SPEAKING CARD TAB */}
      {activeTab === 'create-card' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900">Create New Speaking Challenge</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add a new prompt with duration and vocabulary to the platform deck.
            </p>
          </div>

          <form onSubmit={handleCreateSpeakingCard} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Challenge Title</label>
              <input
                type="text"
                placeholder="e.g. Is Space Exploration Worth the High Cost?"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Proficiency Level</label>
                <select
                  value={newCardLevel}
                  onChange={(e) => setNewCardLevel(e.target.value as ProficiencyLevel)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Speaking Duration (Seconds)</label>
                <select
                  value={newCardDuration}
                  onChange={(e) => setNewCardDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value={30}>30 Seconds</option>
                  <option value={60}>60 Seconds (1 min)</option>
                  <option value={90}>90 Seconds (1.5 min)</option>
                  <option value={120}>120 Seconds (2 min)</option>
                  <option value={180}>180 Seconds (3 min)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Topic Question / Prompt</label>
              <textarea
                rows={3}
                placeholder="Write the full thought-provoking question or speaking instruction here..."
                value={newCardQuestion}
                onChange={(e) => setNewCardQuestion(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Suggested Vocabulary (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Technological breakthrough, Astronomical, Funding allocation"
                value={newCardVocab}
                onChange={(e) => setNewCardVocab(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
              >
                Publish Speaking Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. CLASSROOM MANAGEMENT TAB */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((cls) => (
              <div key={cls.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-base text-slate-900">{cls.name}</h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Code: {cls.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{cls.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>{cls.studentCount} active students</span>
                  <button className="text-purple-600 font-bold hover:underline">
                    View Class Leaderboard
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create new class form */}
          <div className="max-w-xl bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900">Create New Class Cohort</h4>
            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cohort Name</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Oratory Syndicate"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly debate tournament and executive pitch training"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                Create Cohort
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
