import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
let root = null;

const mount = (el) => {
    if (root === null) {
        root = ReactDOM.createRoot(el);
    }    
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
if (process.env.NODE_ENV === 'development') {
    const devRoot = document.querySelector('#scoreboard-dev-root');
    if (devRoot) {
        mount(devRoot);
    }
}


export { mount };