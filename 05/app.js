import React from 'react';
import { createRoot } from 'react-dom/client';

import ContactForm from './ContactForm';

function App() {
    return <ContactForm />;
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
