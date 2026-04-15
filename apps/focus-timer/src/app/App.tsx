import { useEffect, useMemo, useState } from 'preact/hooks';
import { AppShell } from '../components/AppShell';
import { registerSW } from './registerSW';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_PREFIX } from '../lib/constants';
import { DEFAULT_MINUTES } from '../features/timer';

export function App() {
  const [minutes, setMinutes] = useLocalStorage<number>(`${STORAGE_PREFIX}minutes`, DEFAULT_MINUTES);
  const [remainingSeconds, setRemainingSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const totalSeconds = minutes * 60;

  useEffect(() => {
    registerSW();
  }, []);

  useEffect(() => {
    setRemainingSeconds(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  const progress = useMemo(() => {
    if (totalSeconds === 0) return 0;
    return Math.round((remainingSeconds / totalSeconds) * 100);
  }, [remainingSeconds, totalSeconds]);

  const formatted = useMemo(() => {
    const minutesPart = Math.floor(remainingSeconds / 60);
    const secondsPart = remainingSeconds % 60;
    return `${String(minutesPart).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}`;
  }, [remainingSeconds]);

  function resetTimer() {
    setRunning(false);
    setRemainingSeconds(minutes * 60);
  }

  return (
    <AppShell>
      <section class="grid">
        <div class="card">
          <label for="minutes">Duración (minutos)</label>
          <input
            id="minutes"
            type="number"
            min="1"
            max="120"
            value={minutes}
            onInput={(event) => setMinutes(Number((event.target as HTMLInputElement).value || DEFAULT_MINUTES))}
          />
        </div>

        <div class="card">
          <h2>{formatted}</h2>
          <p>Tiempo restante: {progress}%</p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button onClick={() => setRunning(true)} disabled={running}>Iniciar</button>
            <button onClick={() => setRunning(false)} disabled={!running}>Pausar</button>
            <button onClick={resetTimer}>Reiniciar</button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
