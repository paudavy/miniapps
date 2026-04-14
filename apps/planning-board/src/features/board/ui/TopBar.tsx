import { h } from 'preact';
import { InstallButton } from './InstallButton';
import './TopBar.css';

export function TopBar(): h.JSX.Element {
  return (
    <div className="topbar">
      <div className="topbar__brand">
        <span className="topbar__pip" />
        <span>ResPlanner</span>
      </div>
      <div className="topbar__spacer" />
      <InstallButton />
    </div>
  );
}
