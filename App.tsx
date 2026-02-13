
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

  useEffect(() => {
    const saved = localStorage.getItem('zorki_observations');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    setDailyQuestion(DAILY_QUESTIONS[Math.floor(Math.random() * DAILY_QUESTIONS.length)]);
  }, []);

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
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-baseline mb-20 border-b border-zinc-900 pb-8 bg-black sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-light tracking-[0.2em] text-white">ZORKI OBSERVER</h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Метасистема / VIPAP Фреймворк</p>
        </div>
        <div className="text-[10px] text-zinc-600 tracking-tighter font-mono">
          v1.0.5 / {new Date().toLocaleDateString('ru-RU')}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column */}
        <div className="lg:col-span-7">
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-light leading-tight tracking-tight text-white italic">
              «{dailyQuestion}»
            </h2>
          </section>

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

          <section className="mt-12">
            <div className="border border-zinc-800 p-6 bg-black shadow-2xl relative z-10">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-semibold">Новое Наблюдение</h3>
              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Опишите факты текущего состояния, симптомы и отклонения..."
                className="w-full bg-black border-none text-white text-base focus:ring-0 placeholder:text-zinc-800 min-h-[180px] resize-none mb-4 font-light leading-relaxed outline-none"
              />
              <div className="flex justify-end pt-4 border-t border-zinc-900">
                <button
                  onClick={handleSaveObservation}
                  disabled={!observationText.trim()}
                  className="px-8 py-3 bg-white text-black text-[10px] tracking-widest font-bold hover:bg-zinc-200 transition-colors disabled:opacity-20 active:scale-95 transform"
                >
                  ЗАФИКСИРОВАТЬ
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-12">
          <section className="border border-zinc-800 p-8 bg-black">
            <h3 className="text-[10px] uppercase tracking-widest text-red-500 mb-6 font-semibold underline underline-offset-8 decoration-red-900/50">
              Запрещенные Действия
            </h3>
            <ul className="space-y-4">
              {FORBIDDEN_ACTIONS.map((action, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="text-[10px] font-mono text-zinc-800 group-hover:text-red-500 transition-colors">0{idx + 1}</span>
                  <span className="text-xs text-zinc-400 font-light leading-tight group-hover:text-zinc-200 transition-colors">{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">История Наблюдений</h3>
                <button 
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="text-[10px] text-zinc-600 hover:text-white transition-colors underline decoration-zinc-800"
                >
                  {isHistoryExpanded ? 'Свернуть' : 'Развернуть'}
                </button>
             </div>
             
             <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
               {history.length === 0 ? (
                 <p className="text-xs text-zinc-800 italic">Пусто.</p>
               ) : (
                 history.map((obs) => (
                   <div key={obs.id} className="border border-zinc-900 p-5 bg-black hover:border-zinc-700 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-zinc-400 font-bold border border-zinc-800">{translateState(obs.objectState)}</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-zinc-400 font-bold border border-zinc-800">{translateRole(obs.humanRole)}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-800">{new Date(obs.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className={`text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-wrap ${!isHistoryExpanded && 'line-clamp-3 text-zinc-500'}`}>
                        {obs.content}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-[9px] text-zinc-800">{new Date(obs.timestamp).toLocaleDateString('ru-RU')}</span>
                        <button 
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="text-[8px] text-zinc-800 hover:text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Удалить
                        </button>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </section>
        </div>
      </main>

      <footer className="mt-32 pt-12 border-t border-zinc-900 text-center pb-20">
        <p className="text-[9px] tracking-[0.4em] text-zinc-800 uppercase font-medium">
          Наблюдаемость — первичная функция эволюции систем.
        </p>
      </footer>
    </div>
  );
};

export default App;
