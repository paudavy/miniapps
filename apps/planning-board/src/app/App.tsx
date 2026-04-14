import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { TopBar } from '../ui/TopBar';
import { Toolbar } from '../ui/Toolbar';
import { SchedulerPane } from '../ui/SchedulerPane';
import { ContextMenu } from '../ui/ContextMenu';
import { HoverPopover } from '../ui/HoverPopover';
import { StatsBar } from '../ui/StatsBar';
import { clearTransientUi, loadAll } from '../state/actions';
import { registerSW } from './registerSW';
import './App.css';

export function App(): h.JSX.Element {
  useEffect(() => {
    loadAll();
    registerSW();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearTransientUi();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      <div className="app__topbar">
        <TopBar />
      </div>
      <div className="app__toolbar">
        <Toolbar />
      </div>
      <div className="app__scheduler">
        <SchedulerPane />
      </div>
      <div className="app__statsbar">
        <StatsBar />
      </div>
      <HoverPopover />
      <ContextMenu />
    </div>
  );
}
