import { combineReducers } from 'redux'
import InitWeb3Reducer from './init_web3'
import InitTokenReducer from './init_token'
import InitCrowdsaleReducer from './init_crowdsale'
import InitExchangeReducer from './init_exchange'
import FetchAccountReducer from './fetch_account'

const rootReducer = combineReducers({
  web3: InitWeb3Reducer,
  Token: InitTokenReducer,
  Crowdsale: InitCrowdsaleReducer,
  Exchange: InitExchangeReducer,
  account: FetchAccountReducer
})

export default rootReducer
