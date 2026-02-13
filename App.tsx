
import React, { useState, useEffect, useCallback } from 'react';
import { ObjectState, HumanRole, Observation } from './types';
import { 
  OBJECT_STATE_DETAILS, 
  HUMAN_ROLE_DETAILS, 
  FORBIDDEN_ACTIONS, 
  DAILY_QUESTIONS 
} from './constants';
import { StateSwitch } from './components/StateSwitch';

const App: React.FC = () => {
  const [currentObjectState, setCurrentObjectState] = useState<ObjectState>(ObjectState.STABILIZATION);
  const [currentHumanRole, setCurrentHumanRole] = useState<HumanRole>(HumanRole.OBSERVER);
  const [observationText, setObservationText] = useState('');
  const [history, setHistory] = useState<Observation[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('zorki_observations');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    // Set a random daily question
    setDailyQuestion(DAILY_QUESTIONS[Math.floor(Math.random() * DAILY_QUESTIONS.length)]);
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('zorki_observations', JSON.stringify(history));
  }, [history]);

  const handleSaveObservation = useCallback(() => {
    if (!observationText.trim()) return;

    const newObservation: Observation = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      content: observationText,
      objectState: currentObjectState,
      humanRole: currentHumanRole
    };

    setHistory(prev => [newObservation, ...prev]);
    setObservationText('');
  }, [observationText, currentObjectState, currentHumanRole]);

  const handleDeleteObservation = (id: string) => {
    setHistory(prev => prev.filter(obs => obs.id !== id));
  };

  const translateState = (state: ObjectState) => {
    const map: Record<ObjectState, string> = {
      [ObjectState.CONCEPTION]: 'ИДЕЯ',
      [ObjectState.FORMATION]: 'ФОРМИРОВАНИЕ',
      [ObjectState.STABILIZATION]: 'СТАБИЛИЗАЦИЯ',
      [ObjectState.DEGRADATION]: 'ДЕГРАДАЦИЯ',
      [ObjectState.TERMINATION]: 'ЗАВЕРШЕНИЕ'
    };
    return map[state];
  };

  const translateRole = (role: HumanRole) => {
    const map: Record<HumanRole, string> = {
      [HumanRole.OWNER]: 'ВЛАДЕЛЕЦ',
      [HumanRole.STRATEGIST]: 'СТРАТЕГ',
      [HumanRole.SPECIALIST]: 'СПЕЦИАЛИСТ',
      [HumanRole.OBSERVER]: 'НАБЛЮДАТЕЛЬ',
      [HumanRole.OUTSIDER]: 'АУТСАЙДЕР'
    };
    return map[role];
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto selection:bg-white selection:text-black">
      {/* Header */}
      <header className="flex justify-between items-baseline mb-20 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-xl font-light tracking-[0.2em] text-white">ZORKI OBSERVER</h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-1">Метасистема / VIPAP Фреймворк</p>
        </div>
        <div className="text-[10px] text-zinc-600 tracking-tighter">
          v1.0.4 / {new Date().toLocaleDateString('ru-RU')}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Input and Configuration */}
        <div className="lg:col-span-7">
          {/* Hero Question */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-light leading-tight tracking-tight text-white/90 italic">
              «{dailyQuestion}»
            </h2>
          </section>

          {/* Configuration Switches */}
          <section>
            <StateSwitch
              label="Определение Объекта"
              options={Object.values(ObjectState)}
              activeValue={currentObjectState}
              onChange={setCurrentObjectState}
              descriptions={OBJECT_STATE_DETAILS}
              formatter={translateState}
            />

            <StateSwitch
              label="Роль Человека"
              options={Object.values(HumanRole)}
              activeValue={currentHumanRole}
              onChange={setCurrentHumanRole}
              descriptions={HUMAN_ROLE_DETAILS}
              formatter={translateRole}
            />
          </section>

          {/* Observation Entry */}
          <section className="mt-12">
            <div className="border border-zinc-800 p-6 bg-zinc-900/30">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Новое Наблюдение</h3>
              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Опишите факты текущего состояния, симптомы и отклонения..."
                className="w-full bg-transparent border-none text-white text-sm focus:ring-0 placeholder:text-zinc-700 min-h-[150px] resize-none mb-4 font-light leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveObservation}
                  disabled={!observationText.trim()}
                  className="px-6 py-2 bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors disabled:opacity-30"
                >
                  ЗАФИКСИРОВАТЬ В ЖУРНАЛЕ
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Reference and History */}
        <div className="lg:col-span-5 space-y-12">
          {/* Forbidden Actions */}
          <section className="border border-zinc-800 p-8">
            <h3 className="text-[10px] uppercase tracking-widest text-red-500/80 mb-6 font-semibold underline underline-offset-8 decoration-red-900">
              Запрещенные Действия
            </h3>
            <ul className="space-y-4">
              {FORBIDDEN_ACTIONS.map((action, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="text-[10px] font-mono text-zinc-700 group-hover:text-red-900 transition-colors">0{idx + 1}</span>
                  <span className="text-xs text-zinc-400 font-light leading-tight">{action}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* History */}
          <section>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">История Наблюдений</h3>
                <button 
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="text-[10px] text-zinc-600 hover:text-white transition-colors underline"
                >
                  {isHistoryExpanded ? 'Свернуть' : 'Развернуть все'}
                </button>
             </div>
             
             <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
               {history.length === 0 ? (
                 <p className="text-xs text-zinc-700 italic">Записей пока нет.</p>
               ) : (
                 history.map((obs) => (
                   <div key={obs.id} className="border border-zinc-900 p-4 hover:border-zinc-800 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2 items-center">
                          <span className="text-[9px] px-1.5 py-0.5 border border-zinc-700 text-zinc-500 uppercase">{translateState(obs.objectState)}</span>
                          <span className="text-[9px] px-1.5 py-0.5 border border-zinc-700 text-zinc-500 uppercase">{translateRole(obs.humanRole)}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-700">{new Date(obs.timestamp).toLocaleString('ru-RU')}</span>
                      </div>
                      <p className={`text-xs text-zinc-400 font-light leading-relaxed whitespace-pre-wrap ${!isHistoryExpanded && 'line-clamp-2'}`}>
                        {obs.content}
                      </p>
                      <button 
                        onClick={() => handleDeleteObservation(obs.id)}
                        className="mt-4 text-[8px] text-zinc-800 hover:text-red-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Удалить безвозвратно
                      </button>
                   </div>
                 ))
               )}
             </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 pt-12 border-t border-zinc-900 text-center pb-20">
        <p className="text-[9px] tracking-[0.4em] text-zinc-800 uppercase">
          Наблюдаемость — основная функция роста.
        </p>
      </footer>
    </div>
  );
};

export default App;
