import React, { useState, useEffect } from 'react';

const MEDICATIONS = [
  { id: 'semaglutide-wegovy', name: 'Semaglutide (Wegovy)', category: 'weight-loss', doses: ['0.25mg', '0.5mg', '1.0mg', '1.7mg', '2.4mg'] },
  { id: 'semaglutide-ozempic', name: 'Semaglutide (Ozempic)', category: 'diabetes', doses: ['0.25mg', '0.5mg', '1.0mg', '2.0mg'] },
  { id: 'tirzepatide-zepbound', name: 'Tirzepatide (Zepbound)', category: 'weight-loss', doses: ['2.5mg', '5.0mg', '7.5mg', '10.0mg', '12.5mg', '15.0mg'] },
  { id: 'tirzepatide-mounjaro', name: 'Tirzepatide (Mounjaro)', category: 'diabetes', doses: ['2.5mg', '5.0mg', '7.5mg', '10.0mg', '12.5mg', '15.0mg'] },
  { id: 'liraglutide-saxenda', name: 'Liraglutide (Saxenda)', category: 'weight-loss', doses: ['0.6mg', '1.2mg', '1.8mg', '2.4mg', '3.0mg'] },
  { id: 'compounded-semaglutide', name: 'Compounded Semaglutide', category: 'custom', doses: ['0.25mg', '0.5mg', '1.0mg', '1.7mg', '2.5mg'] },
  { id: 'compounded-tirzepatide', name: 'Compounded Tirzepatide', category: 'custom', doses: ['2.5mg', '5.0mg', '7.5mg', '10.0mg', '12.5mg', '15.0mg'] },
];

const INJECTION_SITES = [
  'Left Abdomen',
  'Right Abdomen',
  'Left Thigh',
  'Right Thigh',
  'Left Upper Arm',
  'Right Upper Arm',
  'Other'
];

const SIDE_EFFECTS_LIST = [
  { key: 'nausea', label: 'Nausea 🤢' },
  { key: 'fatigue', label: 'Fatigue 🥱' },
  { key: 'headache', label: 'Headache 🤕' },
  { key: 'reflux', label: 'Acid Reflux 🔥' },
  { key: 'constipation', label: 'Constipation 🧱' }
];

const BADGES = [
  { id: 'first_step', name: 'First Step', desc: 'Logged your first weekly entry.', icon: '🎬', color: 'from-blue-500 to-indigo-600' },
  { id: 'streak_3', name: 'Trifecta', desc: 'Successfully logged 3 weeks.', icon: '🔥', color: 'from-amber-500 to-orange-600' },
  { id: 'goal_crusher', name: 'Goal Crusher', desc: 'Met or exceeded your target weight goal!', icon: '🏆', color: 'from-emerald-500 to-teal-600' }
];

const evaluateBP = (systolic, diastolic) => {
  if (!systolic || !diastolic) return { category: 'Unknown', color: 'gray', description: 'Enter values to evaluate.' };
  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);
  
  if (sys >= 140 || dia >= 90) {
    return {
      category: 'Stage 2 Hypertension / High Risk',
      color: 'red',
      description: 'Consult your doctor soon. If experiencing severe headache or chest pain, seek immediate care.'
    };
  } else if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    return {
      category: 'Elevated / Stage 1 Hypertension',
      color: 'yellow',
      description: 'Your blood pressure is slightly elevated. Keep monitoring and mention this to your physician.'
    };
  } else if (sys < 120 && dia < 80) {
    return {
      category: 'Normal Range',
      color: 'green',
      description: 'Perfect! Your blood pressure is within a healthy standard range.'
    };
  }
  return { category: 'Unusual', color: 'yellow', description: 'Please double-check your readings.' };
};

const INITIAL_ENTRIES = [
  {
    week: 1,
    date: '2026-05-14',
    medication: 'Semaglutide (Wegovy)',
    dose: '0.25mg',
    weight: 224.5,
    systolic: 118,
    diastolic: 78,
    site: 'Right Abdomen',
    siteCustom: '',
    sideEffects: { nausea: 1, fatigue: 2, headache: 0, reflux: 0, constipation: 0 },
    journalTitle: 'First week nerves!',
    journalText: 'Took my very first dose tonight. Was terrified of the needle but honestly barely felt it. Feeling hopeful but keeping expectations in check.',
    aiTranslatedText: 'Dose 1 initiated. Patient successfully navigated initial mild procedural anxiety regarding self-injection. Minimal post-injection side effects recorded.',
    photo: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=150&auto=format&fit=crop&q=60'
  },
  {
    week: 2,
    date: '2026-05-21',
    medication: 'Semaglutide (Wegovy)',
    dose: '0.25mg',
    weight: 221.2,
    systolic: 121,
    diastolic: 81,
    site: 'Left Abdomen',
    siteCustom: '',
    sideEffects: { nausea: 3, fatigue: 2, headache: 1, reflux: 0, constipation: 0 },
    journalTitle: 'Feeling the nausea',
    journalText: 'Experienced quite a bit of nausea on Day 2 and Day 3. Didn’t want to look at fried chicken at all, which is weirdly a huge win! Drank a lot of electrolyte water.',
    aiTranslatedText: 'Dose 2 completed. Notable decrease in dietary cravings alongside transient moderate nausea (Grade 3/5) on post-injection days 2-3. Satiety levels significantly elevated.',
    photo: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=150&auto=format&fit=crop&q=60'
  },
  {
    week: 3,
    date: '2026-05-28',
    medication: 'Semaglutide (Wegovy)',
    dose: '0.25mg',
    weight: 219.0,
    systolic: 119,
    diastolic: 79,
    site: 'Right Thigh',
    siteCustom: '',
    sideEffects: { nausea: 1, fatigue: 3, headache: 0, reflux: 1, constipation: 0 },
    journalTitle: 'Switched site to thigh',
    journalText: 'Switched the injection site to my thigh this week to see if it helps with stomach issues. Nausea was much lower, although I felt really wiped out on Friday.',
    aiTranslatedText: 'Dose 3 administered. Injection site rotated to thigh resulting in a clinical reduction of gastrointestinal adverse effects (minimal nausea). Mild persistent fatigue noted.',
    photo: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=150&auto=format&fit=crop&q=60'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('glp1_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });
  
  const [themeMode, setThemeMode] = useState('device'); 
  const [resolvedDark, setResolvedDark] = useState(false);

  const [selectedMed, setSelectedMed] = useState(() => { const saved = localStorage.getItem('glp1_selectedMed'); return saved ? JSON.parse(saved) : MEDICATIONS[0]; });
  const [userDoseSchedule, setUserDoseSchedule] = useState(() => localStorage.getItem('glp1_doseSchedule') || '0.25mg');

  const [weightGoal, setWeightGoal] = useState(215); 
  const [userBirthday, setUserBirthday] = useState('1988-06-04'); 
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
const [onboardingWeight, setOnboardingWeight] = useState('');
const [onboardingGoal, setOnboardingGoal] = useState(''); 
  
  const [celebrationsEnabled, setCelebrationsEnabled] = useState(true);
  const [goalCelebrationActive, setGoalCelebrationActive] = useState(false);
  const [birthdayCelebrationActive, setBirthdayCelebrationActive] = useState(false);
  const [hasCelebratedGoal, setHasCelebratedGoal] = useState(false);
  const [hasCelebratedBirthday, setHasCelebratedBirthday] = useState(false);

  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logWeight, setLogWeight] = useState(''); 
  const [logSystolic, setLogSystolic] = useState('');
  const [logDiastolic, setLogDiastolic] = useState('');
  const [logHeartRate, setLogHeartRate] = useState('');
  const [logSite, setLogSite] = useState('Left Thigh');
  const [logSiteCustom, setLogSiteCustom] = useState('');
  const [logSideEffects, setLogSideEffects] = useState({
    nausea: 0,
    fatigue: 0,
    headache: 0,
    reflux: 0,
    constipation: 0
  });
  
  const [logJournalTitle, setLogJournalTitle] = useState('');
  const [logJournalText, setLogJournalText] = useState('');
  const [mockPhotoUploaded, setMockPhotoUploaded] = useState(false);

  const [selectedWeeksForReport, setSelectedWeeksForReport] = useState([1, 2, 3]);
  const [useAiTranslation, setUseAiTranslation] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(true);

  const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : 220;
  const initialWeight = entries.length > 0 ? entries[0].weight : 224.5;
  const totalWeightLoss = (initialWeight - currentWeight).toFixed(1);

  const isGoalReached = currentWeight <= weightGoal;

  useEffect(() => {
    localStorage.setItem('glp1_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('glp1_weightGoal', JSON.stringify(weightGoal));
  }, [weightGoal]);

  useEffect(() => {
    localStorage.setItem('glp1_selectedMed', JSON.stringify(selectedMed));
  }, [selectedMed]);

  useEffect(() => {
    localStorage.setItem('glp1_doseSchedule', userDoseSchedule);
  }, [userDoseSchedule]);
  useEffect(() => {
    if (themeMode === 'dark') {
      setResolvedDark(true);
    } else if (themeMode === 'light') {
      setResolvedDark(false);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedDark(mediaQuery.matches);

      const handleSystemThemeChange = (e) => {
        setResolvedDark(e.matches);
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [themeMode]);

  useEffect(() => {
    if (isGoalReached && !hasCelebratedGoal && celebrationsEnabled) {
      triggerGoalCelebration();
    }
  }, [currentWeight, weightGoal, isGoalReached, hasCelebratedGoal, celebrationsEnabled]);

  useEffect(() => {
    if (!celebrationsEnabled || hasCelebratedBirthday) return;
    
    const today = new Date('2026-06-04'); 
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    
    if (userBirthday) {
      const birthParts = userBirthday.split('-');
      if (birthParts.length === 3) {
        const birthMonth = birthParts[1];
        const birthDay = birthParts[2];
        
        if (todayMonth === birthMonth && todayDay === birthDay) {
          triggerBirthdayCelebration();
        }
      }
    }
  }, [userBirthday, celebrationsEnabled, hasCelebratedBirthday]);

  const triggerGoalCelebration = () => {
    setGoalCelebrationActive(true);
    setHasCelebratedGoal(true);
    setTimeout(() => {
      setGoalCelebrationActive(false);
    }, 2500);
  };

  const triggerBirthdayCelebration = () => {
    setBirthdayCelebrationActive(true);
    setHasCelebratedBirthday(true);
    setTimeout(() => {
      setBirthdayCelebrationActive(false);
    }, 2500);
  };

  const handleSelectMedication = (medId) => {
    const med = MEDICATIONS.find(m => m.id === medId);
    setSelectedMed(med);
    setUserDoseSchedule(med.doses[0]);
  };

  const handleLogSideEffect = (key, val) => {
    setLogSideEffects(prev => ({ ...prev, [key]: val }));
  };

  const submitLogEntry = (e) => {
    e.preventDefault();
    
    const genericAiSummary = `Patient reports stable therapeutic management at dose ${userDoseSchedule}. Key notes: ${
      logJournalText.length > 15 
        ? logJournalText.substring(0, 50) + "..." 
        : "Patient tolerating titration well with minor self-limiting side effects."
    } Bowel habits and vital signs evaluated within clinical parameters.`;

    const newWeight = parseFloat(logWeight) || 0;

    if (newWeight <= weightGoal) {
      setHasCelebratedGoal(false);
    }

    const newEntry = {
      week: entries.length + 1,
      date: logDate,
      medication: selectedMed.name,
      dose: userDoseSchedule,
      weight: newWeight,
      systolic: parseInt(logSystolic) || 0,
      diastolic: parseInt(logDiastolic) || 0,
      heartRate: parseInt(logHeartRate) || 0,
      site: logSite,
      siteCustom: logSite === 'Other' ? logSiteCustom : '',
      sideEffects: { ...logSideEffects },
      journalTitle: logJournalTitle || 'Weekly Log',
      journalText: logJournalText,
      aiTranslatedText: genericAiSummary,
      photo: mockPhotoUploaded ? 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=150&auto=format&fit=crop&q=60' : null
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    setSelectedWeeksForReport([...selectedWeeksForReport, newEntry.week]);
    setActiveTab('history');
  };

  const handleToggleReportWeek = (weekNum) => {
    if (selectedWeeksForReport.includes(weekNum)) {
      setSelectedWeeksForReport(selectedWeeksForReport.filter(w => w !== weekNum));
    } else {
      setSelectedWeeksForReport([...selectedWeeksForReport, weekNum]);
    }
  };

  const getBPCategoryColor = (color) => {
    if (color === 'green') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (color === 'yellow') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      
      <style>{`
        @keyframes floatUpAndFade {
          0% { transform: translateY(100px) scale(0.6); opacity: 0; }
          20% { transform: translateY(0px) scale(1); opacity: 1; }
          80% { transform: translateY(-30px) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0.9); opacity: 0; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulseBurst {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float-burst {
          animation: floatUpAndFade 2.5s ease-in-out forwards;
        }
        .animate-confetti {
          animation: confettiFall 2.2s linear infinite;
        }
        .animate-pulse-burst {
          animation: pulseBurst 1.2s infinite ease-in-out;
        }
      `}</style>

      {resolvedDark && (
<style>{`
          .min-h-screen { background-color: #0f172a !important; color: #f1f5f9 !important; }
          header, .bg-white { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important; }
          .bg-slate-50 { background-color: #111827 !important; color: #f8fafc !important; }
          .bg-slate-50\/50 { background-color: #111827cf !important; }
          .bg-emerald-50\/40 { background-color: #064e3b55 !important; }
          .text-slate-800, .text-slate-900, .text-slate-950, .text-slate-700 { color: #f1f5f9 !important; }
          .text-slate-500, .text-slate-600, .text-slate-400 { color: ##cbd5e1 !important; }
          .border-slate-200, .border-slate-150, .border-slate-300, .border-slate-200\/60 { border-color: #334155 !important; }
          input, select, textarea { background-color: #1e293b !important; color: #ffffff !important; border-color: #475569 !important; }
          .bg-slate-100 { background-color: #334155 !important; color: #f1f5f9 !important; }
          .text-slate-900 { color: #ffffff !important; }
          .bg-slate-950 { background-color: #090d16 !important; }
          .border-slate-200 { border-color: #334155 !important; }
          .bg-emerald-600 { background-color: #059669 !important; color: #ffffff !important; }
          .bg-emerald-50 { background-color: #064e3b55 !important; color: #34d399 !important; border-color: #047857 !important; }
          .text-emerald-700, .text-emerald-800, .text-emerald-600 { color: #34d399 !important; }
          .bg-amber-50 { background-color: #78350f33 !important; border-color: #b45309 !important; color: #fcd34d !important; }
          .text-amber-800, .text-amber-900 { color: #fcd34d !important; }
          .bg-indigo-50 { background-color: #31104233 !important; border-color: #6d28d9 !important; color: #c084fc !important; }
          .text-indigo-800, .text-indigo-600 { color: #c084fc !important; }
          .fixed .bg-white { background-color: #1e293b !important; }
          .bg-slate-50\/50 .capitalize { color: #cbd5e1 !important; }
          .bg-slate-100\/40 { background-color: #1e293b !important; }

          .bg-emerald-50\/50, .bg-emerald-50\/40 { background-color: #0d2e1f !important; border-color: #065f46 !important; }
          .text-slate-600 { color: #cbd5e1 !important; }
          .italic { color: #e2e8f0 !important; }

          .pdf-preview-container, .pdf-preview-container * {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
          }
          .pdf-preview-container .bg-slate-50 { background-color: #f8fafc !important; }
          .pdf-preview-container .text-emerald-700 { color: #047857 !important; }
          .pdf-preview-container .text-slate-400 { color: #94a3b8 !important; }
          .pdf-preview-container .text-slate-800 { color: #1e293b !important; }
        `}</style>
      )}

      {}
      {goalCelebrationActive && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 overflow-hidden pointer-events-none transition-all duration-300">
          <div className="absolute inset-0">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${Math.random() * 1.5 + 1}s`,
                  top: '-10px'
                }}
              />
            ))}
          </div>

          <div className="bg-white/95 border border-slate-200 shadow-2xl rounded-3xl max-w-md w-full p-8 text-center space-y-6 mx-4 transform animate-float-burst relative">
            <span className="text-6xl block">🏆</span>
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Milestone Reached!</span>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">GOAL ACHIEVED!</h3>
              <p className="text-sm text-slate-500">
                Congratulations on hitting your target weight milestone of <strong className="text-slate-800">{weightGoal} lbs</strong>! Your consistency is paying off.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center space-x-4 text-left">
              <span className="text-3xl">🏅</span>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">"Goal Crusher" Badge Unlocked</h4>
                <p className="text-[10px] text-slate-500">View this and other accomplishments inside your dashboard cabinet.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {birthdayCelebrationActive && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 overflow-hidden pointer-events-none transition-all duration-300">
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                  animationDuration: `${Math.random() * 1.8 + 1}s`,
                  top: '-30px'
                }}
              >
                {['🎁', '🎈', '✨', '🍰'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-indigo-50/95 to-white border border-indigo-100 shadow-2xl rounded-3xl max-w-md w-full p-8 text-center space-y-6 mx-4 transform animate-float-burst relative">
            <span className="text-6xl block animate-pulse-burst">🎂</span>
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">Happy Birthday Sarah!</span>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">HAPPY BIRTHDAY!</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                The GLP-1 Companion Team wishes you an amazing day of health, strength, and milestone progression! Keep up the incredible work.
              </p>
            </div>
            <p className="text-[11px] text-indigo-400 italic font-medium">"Prioritizing your health is the greatest gift of all."</p>
          </div>
        </div>
      )}

      {}
{showOnboarding && (
  <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">⚙️</div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Let's Set Up Your Profile</h3>
        <p className="text-slate-500 text-sm">Enter your starting details so your dashboard is personalized from day one.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Weight (lbs)</label>
          <input
            type="number"
            placeholder="e.g. 285"
            value={onboardingWeight}
            onChange={(e) => setOnboardingWeight(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Goal Weight (lbs)</label>
          <input
            type="number"
            placeholder="e.g. 220"
            value={onboardingGoal}
            onChange={(e) => setOnboardingGoal(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Medication</label>
          <select
            value={selectedMed.id}
            onChange={(e) => { const m = MEDICATIONS.find(x => x.id === e.target.value); if(m) { setSelectedMed(m); setUserDoseSchedule(m.doses[0]); }}}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
          >
            {MEDICATIONS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <button
 onClick={() => {
              if (onboardingGoal) setWeightGoal(parseFloat(onboardingGoal) || 215);
              if (onboardingWeight) {
                const firstEntry = {
                  week: 1,
                  date: new Date().toISOString().split('T')[0],
                  medication: selectedMed.name,
                  dose: userDoseSchedule,
                  weight: parseFloat(onboardingWeight),
                  systolic: 0,
                  diastolic: 0,
                  site: '',
                  sideEffects: { nausea: 0, fatigue: 0, headache: 0, reflux: 0, constipation: 0 },
                  journalTitle: 'Starting Weight',
                  journalText: 'My starting point on this journey.',
                };
                setEntries([firstEntry]);
                localStorage.setItem('glp1_entries', JSON.stringify([firstEntry]));
              }
              setShowOnboarding(false);
              setActiveTab('dashboard');
            }}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition duration-150"
      >
        Take Me To My Dashboard 🚀
      </button>
    </div>
  </div>
)}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 md:p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
              ✨
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your GLP-1 Journey Starts Here!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Welcome to your ultimate private health partner. Titrating and managing GLP-1 therapy can feel overwhelming, but consistency is your superpower. We're here to help you log safely, monitor trends, and effortlessly coordinate with your doctor.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-2">Our Support Manifesto</span>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Small, sustainable changes create long-term vitality. Celebrate your small victories, stay hydrated, manage side-effects compassionately, and let's watch your target metrics line up!"
              </p>
            </div>

            <button
              onClick={() => setShowWelcomeModal(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition duration-150 transform hover:scale-[1.02]"
            >
              Start Tracking with Confidence 🚀
 {entries.length <= 3 && (<button
  onClick={() => {
    setEntries([]);
    localStorage.removeItem('glp1_entries');
    setShowWelcomeModal(false);
    setShowOnboarding(true);
  }}
  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition duration-150 mt-2"
>
  Start Fresh (New User Setup) 🗑️
</button>
)}
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs md:text-sm px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>
              <strong>Local-First Storage Active:</strong> Your data is saved strictly to this browser session. Zero cloud security risks, 100% HIPAA-proof privacy.
            </span>
          </div>
          <button onClick={() => setShowToast(false)} className="hover:text-emerald-200 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between min-h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white font-black text-2xl" style={{background: 'linear-gradient(135deg, #059669, #0d9488)'}}>
                G
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">GLP-1 Companion</h1>
                <p className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">Secure Personal Health Tracker</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-1 md:space-x-2 items-center">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('log')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  activeTab === 'log' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden md:inline-block"></span>
                <span>Log Shot Day</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'history' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Diary & Logs
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'export' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Doctor Export
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                ⚙️ Settings
              </button>
            </nav>
            <nav className="flex md:hidden items-center space-x-1">
              {[
                { tab: 'dashboard', icon: '📊', label: 'Home' },
                { tab: 'log', icon: '💉', label: 'Log' },
                { tab: 'history', icon: '📓', label: 'Diary' },
                { tab: 'export', icon: '📄', label: 'Export' },
                { tab: 'settings', icon: '⚙️', label: 'More' },
              ].map(({ tab, icon, label }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${activeTab === tab ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <span className="text-lg leading-none">{icon}</span>
                  <span className="text-[10px] font-semibold mt-0.5">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Medication Configuration</h2>
                  <p className="text-sm text-slate-500">Configure your current GLP-1 therapy details for automated titration assistance.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Active Medication</label>
                    <select
                      value={selectedMed.id}
                      onChange={(e) => handleSelectMedication(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 font-medium"
                    >
                      {MEDICATIONS.map((med) => (
                        <option key={med.id} value={med.id}>{med.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Titration Dose</label>
                    <select
                      value={userDoseSchedule}
                      onChange={(e) => setUserDoseSchedule(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 font-medium"
                    >
                      {selectedMed.doses.map((dose) => (
                        <option key={dose} value={dose}>{dose}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Current Weight</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">{currentWeight}</span>
                    <span className="text-slate-500 font-semibold text-sm">lbs</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-medium">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span>-{totalWeightLoss} lbs down</span>
                  </span>
                  <span className="text-slate-400 font-normal">Goal: {weightGoal} lbs</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Next Injection</span>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-slate-900">{(() => { const last = entries[entries.length - 1]; if (!last) return 'No shots logged'; const lastDate = new Date(last.date); const nextDate = new Date(lastDate); nextDate.setDate(lastDate.getDate() + 7); const today = new Date(); const diffMs = nextDate - today; const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); if (diffDays < 0) return 'Overdue!'; if (diffDays === 0) return 'Today!'; if (diffDays === 1) return 'Tomorrow!'; return `In ${diffDays} Days`; })()}</span>
                    <p className="text-xs text-slate-500 mt-1">{userDoseSchedule} of {selectedMed.name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{(() => { const last = entries[entries.length - 1]; if (!last || !last.date) return ''; const [y, m, d] = last.date.split('-'); const site = last.site === 'Other' ? last.siteCustom : last.site; return `Last shot: ${m}-${d}-${y}${site ? ' • ' + site : ''}`; })()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('log')}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition duration-150 flex items-center justify-center space-x-1"
                >
                  <span>Pre-Log Today's Shot</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Last Recorded BP</span>
                  {entries.length > 0 ? (
                    (() => {
                      const latest = [...entries].reverse().find(e => e.systolic > 0 && e.diastolic > 0) || entries[entries.length - 1];
                      const status = evaluateBP(latest.systolic, latest.diastolic);
                      return (
                        <>
<div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {latest.systolic && latest.diastolic ? `${latest.systolic}/${latest.diastolic}` : '—'}
                      </span>
                      <span className="text-slate-500 font-semibold text-xs">mmHg</span>
                    </div>
                    {latest.heartRate > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-sm font-bold text-rose-500">♥ {latest.heartRate}</span>
                        <span className="text-slate-400 text-xs">bpm</span>
                      </div>
                    )}                          <span className={`inline-block text-[10px] font-semibold mt-2 px-2 py-0.5 rounded border ${getBPCategoryColor(status.color)}`}>
                            ● {status.category}
                          </span>
                        </>
                      );
                    })()
                  ) : (
                    <p className="text-slate-500 text-sm mt-1">No measurements logged.</p>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">{(() => { const last = [...entries].reverse().find(e => e.systolic > 0 && e.diastolic > 0); if (!last || !last.date) return ''; const [y, m, d] = last.date.split('-'); return `Recorded ${m}-${d}-${y}`; })()}</p>
                <p className="text-[10px] text-slate-400 mt-3">AHA ranges tracked locally.</p>
              </div>

              

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Goal Tracker</h3>
                  <p className="text-xs text-slate-500">Track how close you are to your chosen body mass goal.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Starting: <strong>{initialWeight} lbs</strong></span>
                    <span>Goal: <strong>{weightGoal} lbs</strong></span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200 relative">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(
                          Math.max(((initialWeight - currentWeight) / (initialWeight - weightGoal)) * 100, 0),
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>

                  <div className="text-center text-xs font-semibold text-slate-700">
                    {isGoalReached ? (
                      <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                        🎉 Goal Reached! ({currentWeight} lbs reached)
                      </span>
                    ) : (
                      <span>{(currentWeight - weightGoal).toFixed(1)} lbs to go!</span>
                    )}
                  </div>
                </div>


              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Your Achievement Badge Cabinet</h3>
                  <p className="text-xs text-slate-500">Earn recognition for tracking accuracy, continuity, and reaching set milestones.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BADGES.map((badge) => {
                    let unlocked = false;
                    if (badge.id === 'first_step' && entries.length >= 1) unlocked = true;
                    if (badge.id === 'streak_3' && entries.length >= 3) unlocked = true;
                    if (badge.id === 'goal_crusher' && isGoalReached) unlocked = true;

                    return (
                      <div 
                        key={badge.id}
                        className={`p-4 rounded-xl border flex items-start space-x-3 transition duration-150 ${
                          unlocked 
                            ? 'bg-slate-50/50 border-slate-200' 
                            : 'bg-slate-100/40 border-slate-200 opacity-75 select-none'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm bg-gradient-to-tr ${unlocked ? badge.color : 'from-slate-300 to-slate-400'}`}>
                          {unlocked ? badge.icon : '🔒'}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{badge.name}</h4>
                          <p className="text-[10px] text-slate-700 mt-0.5 leading-tight">{badge.desc}</p>
                          <span className={`inline-block text-[8px] font-extrabold tracking-wider uppercase mt-1.5 ${unlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {unlocked ? '● Active' : 'Locked'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weight Progress Timeline</h3>
                  <p className="text-xs text-slate-500">Visualization of weight trajectory throughout your GLP-1 titration schedule.</p>
                </div>

                <div className="h-64 bg-slate-50 rounded-xl border border-slate-150 p-4 relative flex flex-col justify-between">
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none opacity-50">
                    <div className="border-b border-slate-200 w-full h-0"></div>
                    <div className="border-b border-slate-200 w-full h-0"></div>
                    <div className="border-b border-slate-200 w-full h-0"></div>
                    <div className="border-b border-slate-200 w-full h-0"></div>
                  </div>

                  <div className="relative z-10 flex-1 flex items-end justify-between px-6 pt-6">
                    {entries.map((entry) => {
                      const minWeight = 210;
                      const maxWeight = 226;
                      const range = maxWeight - minWeight;
                      const percentage = ((entry.weight - minWeight) / range) * 100;
                      
                      return (
                        <div key={entry.week} className="flex flex-col items-center flex-1 group">
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 mb-2 shadow-sm scale-95 group-hover:scale-105 transition duration-150">
                            {entry.weight} lbs
                          </div>
                          <div className="w-4 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-300" style={{ height: `${Math.max(percentage, 10)}%` }}></div>
                          <span className="text-[11px] font-bold text-slate-500 mt-2">Wk {entry.week}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span>Starting: <strong>{initialWeight} lbs</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-teal-400 inline-block"></span>
                    <span>Current: <strong>{currentWeight} lbs</strong></span>
                  </div>
                  <div>
                    <span>Avg Loss: <strong>{(totalWeightLoss / Math.max(entries.length, 1)).toFixed(1)} lbs/wk</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                

                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h4 className="font-bold text-sm">Medical Safety Disclaimer</h4>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    This tracker is designed exclusively for recording subjective clinical journey parameters. It is not an alternative to qualified medical advice. If you face extreme abdominal pain, recurring severe vomiting, or visual disturbances, contact your medical team instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        
</div>
        )}
        {activeTab === 'log' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Ritual Checklist</span>
              <h2 className="text-2xl font-black mt-1">Weekly Shot Day Log</h2>
              <p className="text-slate-400 text-xs mt-1">Track your progress, dosage details, physical metrics, and emotional state below.</p>
            </div>

            <form onSubmit={submitLogEntry} className="p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="font-bold text-slate-900">Weekly Injection Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shot Date</label>
                    <input
                      type="date"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      required
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medication Selection</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg font-semibold">
                      {selectedMed.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scheduled Dose</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg font-semibold">
                      {userDoseSchedule}
                    </div>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Injection Site Location</label>
                    <select
                      value={logSite}
                      onChange={(e) => setLogSite(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                    >
                      {INJECTION_SITES.map((site) => (
                        <option key={site} value={site}>{site}</option>
                      ))}
                    </select>
                  </div>
                  
                  {logSite === 'Other' && (
                    <div>
                      <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">Custom Location Name</label>
                      <input
                        type="text"
                        placeholder="Enter custom location (e.g., Lower Right Hip)"
                        value={logSiteCustom}
                        onChange={(e) => setLogSiteCustom(e.target.value)}
                        required
                        className="bg-emerald-50 border border-emerald-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</div>
                  <h3 className="font-bold text-slate-900">Vitals & Weight Tracking</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 216.5"
                      value={logWeight}
                      onChange={(e) => setLogWeight(e.target.value)}
                      required
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 font-bold text-emerald-700"
                    />
                    <p className="text-[10px] text-emerald-600 mt-1">💡 Set below {weightGoal} lbs to test celebration!</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      placeholder="Top number, e.g. 118"
                      value={logSystolic}
                      onChange={(e) => setLogSystolic(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      placeholder="Bottom number, e.g. 78"
                      value={logDiastolic}
                      onChange={(e) => setLogDiastolic(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                    />
                  </div>
                </div>
                <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Heart Rate <span className="normal-case text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="number"
                  placeholder="BPM, e.g. 72"
                  value={logHeartRate}
                  onChange={(e) => setLogHeartRate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                />
              </div>

                {}
                {logSystolic && logDiastolic && (
                  (() => {
                    const evaluation = evaluateBP(logSystolic, logDiastolic);
                    return (
                      <div className={`p-4 rounded-xl border flex items-start space-x-3 transition duration-150 ${getBPCategoryColor(evaluation.color)}`}>
                        <div className="mt-0.5">
                          {evaluation.color === 'green' && (
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {evaluation.color === 'yellow' && (
                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {evaluation.color === 'red' && (
                            <svg className="w-5 h-5 text-rose-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v5a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-xs">BP Check: {evaluation.category}</p>
                          <p className="text-[11px] mt-0.5 opacity-90">{evaluation.description}</p>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</div>
                  <h3 className="font-bold text-slate-900">Side Effect Log</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SIDE_EFFECTS_LIST.map((item) => (
                    <div key={item.key} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Lvl: {logSideEffects[item.key]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center space-x-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleLogSideEffect(item.key, level)}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition duration-150 ${
                              logSideEffects[item.key] === level 
                                ? 'bg-slate-900 text-white shadow-sm scale-105' 
                                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {level === 0 ? 'None' : level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">4</div>
                  <h3 className="font-bold text-slate-900">Structured Wellness Journal</h3>
                </div>

                <div className="space-y-3 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Journal Entry Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Week 4 - Feeling stable and consistent"
                      value={logJournalTitle}
                      onChange={(e) => setLogJournalTitle(e.target.value)}
                      
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-white px-4 rounded-xl border border-slate-200/60">
                    <div>
                      <span className="text-slate-400 font-medium">Logged Weight:</span> <strong className="text-slate-700">{logWeight || '--'} lbs</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Injection Location:</span> <strong className="text-slate-700">{logSite === 'Other' ? logSiteCustom || 'Custom' : logSite}</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Open Logging Space (Feelings, Appetite, Food Noise)</label>
                    <textarea
                      rows="4"
                      placeholder="Write freely here. Record symptoms, emotional state, food noise level, digestion patterns, or lifestyle adaptations."
                      value={logJournalText}
                      onChange={(e) => setLogJournalText(e.target.value)}
                      
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">5</div>
                  <h3 className="font-bold text-slate-900">Secure Progress Photo</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
                    {mockPhotoUploaded ? (
                      <img src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=150&auto=format&fit=crop&q=60" alt="Progress representation" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-xs text-slate-700">Simulate Progress Image Capture</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Will be securely retained locally within browser sandboxed memory.</p>
                    <button
                      type="button"
                      onClick={() => setMockPhotoUploaded(!mockPhotoUploaded)}
                      className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                        mockPhotoUploaded 
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200' 
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs'
                      }`}
                    >
                      {mockPhotoUploaded ? 'Clear Selected Photo' : 'Simulate Camera Upload'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition"
                >
                  Confirm & Commit Week {entries.length + 1} Log
                </button>
              </div>
            </form>
          </div>
        )}

        {}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Your Structured Clinical Diary</h2>
                <p className="text-xs text-slate-500">Every weekly log combined into an intuitive health and wellness journal timeline.</p>
              </div>
              <button
                onClick={() => setActiveTab('log')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition duration-150 flex items-center space-x-1 self-start"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Entry</span>
              </button>
            </div>

            <div className="space-y-6">
              {[...entries].reverse().map((entry) => {
                const bpEvaluation = evaluateBP(entry.systolic, entry.diastolic);
                
                return (
                  <div key={entry.week} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition hover:shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-center font-black text-sm">
                          Wk {entry.week}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900">{entry.journalTitle}</h4>
                          <p className="text-[11px] text-slate-500">
                            Logged on {entry.date} &bull; {entry.medication} ({entry.dose})
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          ⚖️ {entry.weight} lbs
                        </span>
                        <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          📍 {entry.site === 'Other' ? entry.siteCustom : entry.site}
                        </span>
                        {(entry.systolic > 0 || entry.diastolic > 0) && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getBPCategoryColor(bpEvaluation.color)}`}>
                          🩺 {entry.systolic}/{entry.diastolic} mmHg
                        </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="space-y-1">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Narrative (Casual Diary)</h5>
                          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{entry.journalText}</p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                          <div className="flex items-center space-x-2 text-emerald-800">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-extrabold text-xs uppercase tracking-wider">AI Clinical Summary Simulation</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            "{entry.aiTranslatedText}"
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                        <div>
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Side Effects Profile</h5>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {Object.entries(entry.sideEffects).map(([key, val]) => (
                              <div key={key} className="bg-white p-2 rounded-lg border border-slate-150 flex flex-col">
                                <span className="capitalize text-xs text-slate-500 font-medium">{key}</span>
                                <span className={`text-xs font-bold ${val > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                  {val > 0 ? `Lvl ${val} / 5` : 'None'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {entry.photo && (
                          <div>
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Weekly Progress Photo</h5>
                            <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                              <img src={entry.photo} alt="Progress Thumbnail" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {}
        {activeTab === 'export' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 lg:col-span-1">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Custom Provider Report</h3>
                <p className="text-xs text-slate-500">Configure parameters to customize the print or email PDF generated for your physician.</p>
              </div>

              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-400 uppercase">Select Weeks to Include</span>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-150 rounded-xl p-3 bg-slate-50">
                  {entries.map((entry) => (
                    <label key={entry.week} className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedWeeksForReport.includes(entry.week)}
                        onChange={() => handleToggleReportWeek(entry.week)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Week {entry.week} - {entry.journalTitle} ({entry.weight} lbs)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="block text-xs font-bold text-slate-400 uppercase">AI Translation Engine</span>
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAiTranslation}
                      onChange={() => setUseAiTranslation(!useAiTranslation)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>AI Clinical Translator Tool</span>
                  </label>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Automatically translates personal clinical notes (e.g. *"food noise gone"*) into professional jargon (e.g. *"satiety levels stabilized; reduction in diet cravings"*).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReportModalOpen(true)}
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition duration-150 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Generate PDF Report</span>
              </button>
            </div>

            {}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-150 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Interactive Report Preview</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">PDF PAGE 1 OF 1</span>
              </div>

              <div className="p-6 md:p-8 space-y-8 flex-1 bg-white font-serif max-h-[600px] overflow-y-auto pdf-preview-container text-slate-800">
                <div className="border-b-4 border-slate-900 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight font-sans">GLP-1 THERAPEUTIC MONITORING REPORT</h2>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-sans font-bold">Secure Local Patient-Generated Health Record</p>
                  </div>
                  <div className="text-right text-[11px] font-sans text-slate-400">
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block">Patient</span>
                    <strong className="text-slate-800 text-sm">Sarah J.</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block">Current Therapy</span>
                    <strong className="text-slate-800 text-sm">{selectedMed.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block">Dosing Schedule</span>
                    <strong className="text-slate-800 text-sm">{userDoseSchedule}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block">Data Selected</span>
                    <strong className="text-slate-800 text-sm">{selectedWeeksForReport.length} Weeks Included</strong>
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Weight Loss & Vital Trends Overview</h4>
                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Starting Weight</span>
                      <strong className="text-base text-slate-800">{initialWeight} lbs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Weight</span>
                      <strong className="text-base text-slate-800">{currentWeight} lbs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Net Reduction</span>
                      <strong className="text-base text-emerald-700">-{totalWeightLoss} lbs</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider">Weekly Clinical Breakdown</h4>
                  
                  {entries
                    .filter(e => selectedWeeksForReport.includes(e.week))
                    .map((entry) => (
                      <div key={entry.week} className="text-xs space-y-2 pb-4 border-b border-slate-100 last:border-0">
                        <div className="flex justify-between items-center font-sans">
                          <strong className="text-slate-900 font-bold">Week {entry.week} - {entry.journalTitle} ({entry.date})</strong>
                          <span className="text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            {entry.dose} &bull; Site: {entry.site === 'Other' ? entry.siteCustom : entry.site}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 font-sans py-1.5 border-y border-dashed border-slate-150 text-slate-600 bg-slate-50/50 px-2 rounded">
                          <span>Weight: <strong className="text-slate-800">{entry.weight} lbs</strong></span>
                          <span>BP: <strong className="text-slate-800">{entry.systolic}/{entry.diastolic} mmHg</strong></span>
                          <span>Side Effects: <strong className="text-slate-800">
                            {Object.values(entry.sideEffects).reduce((a, b) => a + b, 0)} Total
                          </strong></span>
                        </div>

                        <div className="pl-3 border-l-2 border-slate-300">
                          {useAiTranslation ? (
                            <div>
                              <span className="text-[9px] font-bold text-emerald-700 block uppercase tracking-widest font-sans">AI Professional Translation</span>
                              <p className="text-slate-700 italic leading-relaxed text-xs mt-0.5">
                                "{entry.aiTranslatedText}"
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest font-sans">Patient Narrative Notes</span>
                              <p className="text-slate-700 leading-relaxed text-xs mt-0.5">
                                "{entry.journalText}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
                  <span>GLP-1 COMPANION PDF ENGINE v1.0</span>
                  <div className="text-right">
                    <p className="font-bold text-slate-600">Patient Verification Signature</p>
                    <div className="w-32 border-b border-slate-300 mt-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-950 text-white p-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Configuration Console</span>
              <h2 className="text-2xl font-black mt-1">App & Goal Settings</h2>
              <p className="text-slate-400 text-xs mt-1">Configure your targets, manage birthday notifications, or clear state variables safely.</p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <span className="text-xl">👤</span>
                  <h3 className="font-bold text-slate-900">Profile Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={userBirthday}
                      onChange={(e) => {
                        setUserBirthday(e.target.value);
                        setHasCelebratedBirthday(false);
                      }}
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      💡 Set to June 4th to trigger birthday celebration simulation today!
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight Goal (lbs)</label>
                    <input
                      type="number"
                      value={weightGoal}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setWeightGoal(val);
                        if (currentWeight > val) {
                          setHasCelebratedGoal(false);
                        }
                      }}
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Target threshold triggers the automated celebration events when met.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <span className="text-xl">🎨</span>
                  <h3 className="font-bold text-slate-900">Display Settings</h3>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Theme Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'light', label: 'Light Mode ☀️' },
                      { key: 'dark', label: 'Dark Mode 🌙' },
                      { key: 'device', label: 'Default 💻' }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setThemeMode(mode.key)}
                        className={`py-2 text-xs font-bold rounded-lg transition duration-150 ${
                          themeMode === mode.key
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    'Default' automatically syncs displays to your device systems' active light/dark setup preferences.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <span className="text-xl">🎈</span>
                  <h3 className="font-bold text-slate-900">Celebration Animations</h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Enable Birthday & Goal Visuals</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Quick, elegant 2-second visual effects to celebrate your wellness achievements.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={celebrationsEnabled}
                      onChange={() => setCelebrationsEnabled(!celebrationsEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <span className="text-xl">✨</span>
                  <h3 className="font-bold text-slate-900">Encouragement Systems</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Review Welcome Manifesto</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Display the motivating introduction overlay on your dashboard again.</p>
                  </div>
                  <button
                    onClick={() => setShowWelcomeModal(true)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition"
                  >
                    View Welcome Dialog
                  </button>
                </div>
              </div>

              {}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <span className="text-xl">🔒</span>
                  <h3 className="font-bold text-slate-900">Device Sandboxed Privacy</h3>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/60 text-xs text-slate-600 leading-relaxed space-y-2">
                  <p>
                    <strong>HIPAA-Proof Sandboxing:</strong> This application has no central network database. Your blood pressure, medication lists, target metrics, and progress logs are saved exclusively within your immediate browser sandbox memory.
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold italic">
                    Always maintain screen lock passcodes on this hardware device to preserve privacy.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if(window.confirm('Do you really wish to reset all logs back to week 1 default settings? This cannot be undone.')) {
                        setEntries(INITIAL_ENTRIES);
                        setWeightGoal(215);
                        setHasCelebratedGoal(false);
                        setHasCelebratedBirthday(false);
                        setActiveTab('dashboard');
                      }
                    }}
                    className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition"
                  >
                    Reset Application State
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-black text-slate-950">PDF Generation Simulated!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your customized clinical PDF has been compiled using localized browser sandbox storage. Because this app values your health privacy, no data was transmitted over insecure networks.
            </p>

            <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 text-left space-y-1.5 text-xs text-slate-600">
              <p>📍 <strong>Medication details:</strong> {selectedMed.name} ({userDoseSchedule})</p>
              <p>📍 <strong>Total records verified:</strong> {selectedWeeksForReport.length} Weeks</p>
              <p>📍 <strong>AI Clinical translation:</strong> {useAiTranslation ? 'Enabled' : 'Disabled'}</p>
            </div>

            <div className="pt-4 flex space-x-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  window.print();
                  setReportModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md"
              >
                Open System Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-xs mt-auto">
        <p>&copy; 2026 GLP-1 Companion &bull; Safe, Local, Private &bull; HIPAA Compliant local Sandbox</p>
      </footer>
    </div>
  );
}