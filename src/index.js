import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import promise from 'redux-promise';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
registerServiceWorker();

export { store };
