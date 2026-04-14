import { h } from 'preact';
import './TopBar.css';
import { InstallButton } from '../ui/InstallButton';

export function TopBar(): h.JSX.Element {
  return (
    <div className="topbar">
      <div className="topbar__brand">
        <span className="topbar__pip" />
        <span>Planning Board</span>
      </div>
      <div className="topbar__spacer" />
      <InstallButton />
    </div>
  );
}
