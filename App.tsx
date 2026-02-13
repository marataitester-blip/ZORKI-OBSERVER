
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
        console.error("Ошибка загрузки истории:", e);
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
    <div className="min-h-screen bg-black text-white p-6 md:p-12 max-w-6xl mx-auto flex flex-col">
      {/* Header - Максимальный приоритет (z-100) и непрозрачный черный фон */}
      <header className="flex justify-between items-baseline mb-20 border-b border-zinc-900 pb-8 bg-black sticky top-0 z-[100]">
        <div className="bg-black pr-4">
          <h1 className="text-xl font-light tracking-[0.2em] text-white">ZORKI OBSERVER</h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Метасистема / VIPAP Фреймворк</p>
        </div>
        <div className="text-[10px] text-zinc-700 tracking-tighter font-mono bg-black pl-4">
          v1.0.7 / {new Date().toLocaleDateString('ru-RU')}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
        {/* Левая колонка */}
        <div className="lg:col-span-7 space-y-16">
          <section className="relative">
            <h2 className="text-3xl md:text-4xl font-light leading-tight tracking-tight text-white italic">
              «{dailyQuestion}»
            </h2>
          </section>

          <section className="relative z-20">
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

          <section className="relative z-10">
            <div className="border border-zinc-900 p-8 bg-black shadow-[0_0_50px_rgba(0,0,0,1)]">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-6 font-bold">Новое Наблюдение</h3>
              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Зафиксируйте факты без оценочных суждений..."
                className="w-full bg-black border-none text-white text-base focus:ring-0 placeholder:text-zinc-600 min-h-[220px] resize-none mb-6 font-light leading-relaxed outline-none"
              />
              <div className="flex justify-end pt-6 border-t border-zinc-900">
                <button
                  onClick={handleSaveObservation}
                  disabled={!observationText.trim()}
                  className="px-10 py-4 bg-white text-black text-[10px] tracking-[0.2em] font-black hover:bg-zinc-200 transition-all disabled:opacity-5 active:scale-95 shadow-lg"
                >
                  ЗАПИСАТЬ
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Правая колонка */}
        <div className="lg:col-span-5 space-y-12">
          <section className="border border-zinc-900 p-8 bg-black relative">
            <h3 className="text-[10px] uppercase tracking-widest text-red-700 mb-6 font-bold underline underline-offset-8 decoration-red-900/40">
              Запрещенные Действия
            </h3>
            <ul className="space-y-5">
              {FORBIDDEN_ACTIONS.map((action, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="text-[10px] font-mono text-zinc-800 group-hover:text-red-700 transition-colors">0{idx + 1}</span>
                  <span className="text-xs text-zinc-400 font-light leading-snug group-hover:text-zinc-200 transition-colors">{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Журнал состояний</h3>
                <button 
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="text-[10px] text-zinc-600 hover:text-white transition-colors underline decoration-zinc-900"
                >
                  {isHistoryExpanded ? 'Свернуть' : 'Развернуть'}
                </button>
             </div>
             
             <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4">
               {history.length === 0 ? (
                 <p className="text-xs text-zinc-800 italic">Событий не зафиксировано.</p>
               ) : (
                 history.map((obs) => (
                   <div key={obs.id} className="border border-zinc-900 p-6 bg-black hover:border-zinc-700 transition-all group relative">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2 items-center">
                          <span className="text-[8px] px-2 py-0.5 bg-zinc-950 text-zinc-400 font-bold border border-zinc-800">{translateState(obs.objectState)}</span>
                          <span className="text-[8px] px-2 py-0.5 bg-zinc-950 text-zinc-400 font-bold border border-zinc-800">{translateRole(obs.humanRole)}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-800 uppercase">{new Date(obs.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className={`text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-wrap relative z-10 ${!isHistoryExpanded && 'line-clamp-3 text-zinc-500'}`}>
                        {obs.content}
                      </p>
                      <div className="mt-6 flex justify-between items-center pt-4 border-t border-zinc-900/30">
                        <span className="text-[9px] text-zinc-800 font-mono">{new Date(obs.timestamp).toLocaleDateString('ru-RU')}</span>
                        <button 
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="text-[8px] text-zinc-900 hover:text-red-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-bold px-2 py-1"
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

      <footer className="mt-auto pt-24 pb-20 border-t border-zinc-900 text-center bg-black relative z-10">
        <p className="text-[9px] tracking-[0.5em] text-zinc-800 uppercase font-semibold">
          Наблюдаемость — первичная функция эволюции систем.
        </p>
      </footer>
    </div>
  );
};

export default App;
