import React from 'react';
import { render } from 'react-dom';

import App from 'layouts/App';

import './index.scss';

if (module.hot) {
  module.hot.accept();
}

render(<App />, document.getElementById('root'));
