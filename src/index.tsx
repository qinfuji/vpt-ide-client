//import 'babel-polyfill';
import * as React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import Root from './Root';
import routeConfig from './common/routeConfig';
import configStore from './common/configStore';
import { initializeIcons } from '@uifabric/icons';
import { loadTheme } from 'office-ui-fabric-react/lib/Styling';
import * as overTheme from './features/app/appTheme.json';
//import { library } from '@fortawesome/fontawesome-svg-core';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';

//library.add(faStroopwafel);

initializeIcons();

const finalTheme = loadTheme({ ...{ palette: overTheme } });
document.body.style.backgroundColor = finalTheme.semanticColors.bodyBackground;
document.body.style.color = finalTheme.semanticColors.bodyText;

const store = configStore();
let root = document.getElementById('react-root');
if (!root) {
  root = document.createElement('div');
  root.id = 'react-root';
  document.body.appendChild(root);
}

function renderApp(app: JSX.Element) {
  render(<AppContainer>{app}</AppContainer>, root);
}

renderApp(<Root routeConfig={routeConfig} store={store} />);

if (module.hot) {
  module.hot.accept();
}
