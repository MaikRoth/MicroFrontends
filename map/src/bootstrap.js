import { createApp } from 'vue';
import App from './App.vue';

let appInstance = null;

const mount = (selector) => {
    if (appInstance === null) {
        appInstance = createApp(App).mount(selector);
    }
};

if (process.env.NODE_ENV === 'development') {
    const devRoot = document.querySelector('#map-dev-root');    
    if (devRoot){
        mount(devRoot);
    }
    
}

export { mount };
