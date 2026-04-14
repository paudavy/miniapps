import { render } from 'preact';
import { App } from './app/App';
import './styles/reset.css';
import './styles/tokens.css';

render(<App />, document.getElementById('app')!);
