import React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const assert = require('assert')

assert.equal(typeof process.env.REACT_APP_ENCRYPTION_PASS, 'string', 'We need password!')
assert.equal(typeof process.env.REACT_APP_HASH_PASS, 'string', 'We need hash password!')

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
