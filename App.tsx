
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
      [ObjectState.STABILIZATION]: 'СПЕЦИАЛИЗАЦИЯ',
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
    <div className="min-h-screen text-black p-6 md:p-12 max-w-6xl mx-auto flex flex-col relative isolate bg-[#fcfcfc]">
      {/* Header - Максимальный приоритет над скроллом */}
      <header className="flex justify-between items-baseline mb-20 border-b border-[#D4AF37] pb-8 sticky top-0 bg-white/95 backdrop-blur-xl z-[100] isolate shadow-sm">
        <div className="relative z-[101]">
          <h1 className="text-4xl font-black tracking-[0.2em] text-black uppercase">ZORKI OBSERVER</h1>
          <p className="text-base uppercase tracking-[0.25em] text-zinc-500 mt-2 font-bold">Метасистема / VIPAP Фреймворк</p>
        </div>
        <div className="text-sm text-zinc-400 tracking-tighter font-mono uppercase relative z-[101] font-black">
          v1.1.0 / {new Date().toLocaleDateString('ru-RU')}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 isolate">
        {/* Левая колонка */}
        <div className="lg:col-span-7 space-y-16 relative z-10">
          <section className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-light leading-tight tracking-tight text-black italic relative z-[20]">
              «{dailyQuestion}»
            </h2>
          </section>

          <section className="relative z-40">
            <StateSwitch
              label="Определение Объекта"
              options={Object.values(ObjectState) as ObjectState[]}
              activeValue={currentObjectState}
              onChange={(val) => setCurrentObjectState(val)}
              descriptions={OBJECT_STATE_DETAILS}
              formatter={translateState}
            />

            <StateSwitch
              label="Роль Человека"
              options={Object.values(HumanRole) as HumanRole[]}
              activeValue={currentHumanRole}
              onChange={(val) => setCurrentHumanRole(val)}
              descriptions={HUMAN_ROLE_DETAILS}
              formatter={translateRole}
            />
          </section>

          <section className="relative z-10">
            <div className="border gold-border gold-glow p-8 bg-white/80 relative isolate overflow-hidden">
              <div className="absolute inset-0 bg-white/50 -z-10"></div>
              
              <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-6 font-black relative z-20">Новое Наблюдение</h3>
              <div className="relative z-20">
                <textarea
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  placeholder="Зафиксируйте факты..."
                  className="w-full bg-transparent border-none text-2xl focus:ring-0 placeholder:text-zinc-300 min-h-[220px] resize-none mb-6 font-light leading-relaxed outline-none"
                />
              </div>
              
              <div className="flex justify-end pt-6 border-t border-[#D4AF37]/30 relative z-20">
                <button
                  onClick={handleSaveObservation}
                  disabled={!observationText.trim()}
                  className="px-12 py-5 bg-black text-white text-sm tracking-[0.3em] font-black hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-20 active:scale-95 shadow-xl relative z-30"
                >
                  ЗАПИСАТЬ
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Правая колонка */}
        <div className="lg:col-span-5 space-y-12 relative z-10">
          <section className="border gold-border gold-glow p-8 bg-white/70 relative isolate">
            <div className="absolute inset-0 bg-white/30 -z-10"></div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#B8860B] mb-8 font-black underline underline-offset-8 decoration-[#D4AF37]/40 relative z-20">
              Запрещенные Действия
            </h3>
            <ul className="space-y-6 relative z-20">
              {FORBIDDEN_ACTIONS.map((action, idx) => (
                <li key={idx} className="flex items-start gap-5 group">
                  <span className="text-sm font-mono text-[#D4AF37] font-black mt-1">0{idx + 1}</span>
                  <span className="text-lg text-black font-bold leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative z-10">
             <div className="flex justify-between items-center mb-8 relative z-20">
                <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-400 font-black">Журнал состояний</h3>
                <button 
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="text-sm font-black text-zinc-500 hover:text-black transition-colors underline decoration-zinc-300 underline-offset-4"
                >
                  {isHistoryExpanded ? 'Свернуть' : 'Развернуть'}
                </button>
             </div>
             
             <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 relative z-10">
               {history.length === 0 ? (
                 <p className="text-base text-zinc-400 italic relative z-20 font-medium">Событий не зафиксировано.</p>
               ) : (
                 history.map((obs) => (
                   <div key={obs.id} className="border gold-border p-8 bg-white/50 hover:gold-glow transition-all group relative isolate">
                      <div className="absolute inset-0 bg-white/20 -z-10"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-20">
                        <div className="flex gap-3 items-center">
                          <span className="text-xs px-3 py-1 bg-[#D4AF37] text-black font-black uppercase tracking-wider">{translateState(obs.objectState)}</span>
                          <span className="text-xs px-3 py-1 border-2 gold-border text-[#B8860B] font-black uppercase tracking-wider">{translateRole(obs.humanRole)}</span>
                        </div>
                        <span className="text-sm font-mono text-zinc-400 font-black">{new Date(obs.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <p className={`text-2xl text-black font-bold leading-relaxed whitespace-pre-wrap relative z-20 ${!isHistoryExpanded && 'line-clamp-3 opacity-90'}`}>
                        {obs.content}
                      </p>
                      
                      <div className="mt-8 flex justify-between items-center pt-6 border-t border-[#D4AF37]/10 relative z-20">
                        <span className="text-sm text-zinc-400 font-mono font-black uppercase tracking-widest">{new Date(obs.timestamp).toLocaleDateString('ru-RU')}</span>
                        <button 
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="text-xs text-red-800 hover:text-red-600 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity font-black p-1"
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

      <footer className="mt-auto pt-24 pb-20 border-t border-zinc-100 text-center relative z-10 isolate">
        <p className="text-sm tracking-[0.5em] text-zinc-300 uppercase font-black relative z-20">
          Наблюдаемость — первичная функция эволюции систем.
        </p>
      </footer>
    </div>
  );
};

export default App;
