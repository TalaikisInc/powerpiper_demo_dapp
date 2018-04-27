import { combineReducers } from 'redux'

import Web3 from './web3'
import Token from './token'
import Crowdsale from './crowdsale'
import Account from './account'
import IPFS from './ipfs'
import Gas from './gas'

const root = combineReducers({
  web3: Web3,
  Token: Token,
  Crowdsale: Crowdsale,
  ipfs: IPFS,
  account: Account,
  gasPrice: Gas
})

export default root
