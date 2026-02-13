
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
    <div className="min-h-screen text-black p-6 md:p-12 max-w-6xl mx-auto flex flex-col relative">
      {/* Header - Прозрачный, с черным текстом и золотой линией */}
      <header className="flex justify-between items-baseline mb-20 border-b border-[#D4AF37] pb-8 sticky top-0 bg-white/80 backdrop-blur-md z-[100]">
        <div>
          <h1 className="text-xl font-black tracking-[0.2em] text-black">ZORKI OBSERVER</h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Метасистема / VIPAP Фреймворк</p>
        </div>
        <div className="text-[10px] text-zinc-400 tracking-tighter font-mono uppercase">
          v1.0.8 / {new Date().toLocaleDateString('ru-RU')}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        {/* Левая колонка */}
        <div className="lg:col-span-7 space-y-16">
          <section>
            <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight text-black italic">
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

          <section>
            <div className="border gold-border gold-glow p-8 bg-white/40 backdrop-blur-sm relative overflow-hidden">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6 font-bold">Новое Наблюдение</h3>
              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Зафиксируйте факты..."
                className="w-full bg-transparent border-none text-black text-lg focus:ring-0 placeholder:text-zinc-300 min-h-[220px] resize-none mb-6 font-light leading-relaxed outline-none relative z-10"
              />
              <div className="flex justify-end pt-6 border-t border-[#D4AF37]/20">
                <button
                  onClick={handleSaveObservation}
                  disabled={!observationText.trim()}
                  className="px-10 py-4 bg-black text-white text-[10px] tracking-[0.2em] font-black hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-10 active:scale-95 shadow-xl"
                >
                  ЗАПИСАТЬ
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Правая колонка */}
        <div className="lg:col-span-5 space-y-12">
          <section className="border gold-border gold-glow p-8 bg-white/30 backdrop-blur-sm">
            <h3 className="text-[10px] uppercase tracking-widest text-[#B8860B] mb-6 font-black underline underline-offset-8 decoration-[#D4AF37]/40">
              Запрещенные Действия
            </h3>
            <ul className="space-y-5">
              {FORBIDDEN_ACTIONS.map((action, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">0{idx + 1}</span>
                  <span className="text-xs text-black font-medium leading-snug">{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Журнал состояний</h3>
                <button 
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="text-[10px] text-zinc-500 hover:text-black transition-colors underline decoration-zinc-200"
                >
                  {isHistoryExpanded ? 'Свернуть' : 'Развернуть'}
                </button>
             </div>
             
             <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4">
               {history.length === 0 ? (
                 <p className="text-xs text-zinc-400 italic">Событий не зафиксировано.</p>
               ) : (
                 history.map((obs) => (
                   <div key={obs.id} className="border gold-border p-6 bg-white/20 hover:gold-glow transition-all group relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2 items-center">
                          <span className="text-[8px] px-2 py-0.5 bg-[#D4AF37] text-black font-black">{translateState(obs.objectState)}</span>
                          <span className="text-[8px] px-2 py-0.5 border gold-border text-[#B8860B] font-black">{translateRole(obs.humanRole)}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400">{new Date(obs.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className={`text-sm text-black font-medium leading-relaxed whitespace-pre-wrap relative z-20 ${!isHistoryExpanded && 'line-clamp-3 opacity-60'}`}>
                        {obs.content}
                      </p>
                      <div className="mt-6 flex justify-between items-center pt-4 border-t border-[#D4AF37]/10">
                        <span className="text-[9px] text-zinc-400 font-mono">{new Date(obs.timestamp).toLocaleDateString('ru-RU')}</span>
                        <button 
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="text-[8px] text-red-800 hover:text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-bold"
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

      <footer className="mt-auto pt-24 pb-20 border-t border-zinc-100 text-center relative z-10">
        <p className="text-[9px] tracking-[0.5em] text-zinc-300 uppercase font-semibold">
          Наблюдаемость — первичная функция эволюции систем.
        </p>
      </footer>
    </div>
  );
};

export default App;
