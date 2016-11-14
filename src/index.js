import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Proposals from './Proposals';
import Awards from './Awards';

import './index.css';
import { Router, Route, browserHistory } from 'react-router';

function NoMatch() {
  return <div>No Page Found</div>;
}


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="proposals" component={Proposals}/>
      <Route path="awards" component={Awards}/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>,
  document.getElementById('root')
);
