import React from 'react';
import { createRoot } from 'react-dom/client';
import SpeedTest from './SpeedTest';

function App() {
    return <SpeedTest />;
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
