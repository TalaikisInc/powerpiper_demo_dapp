 import React from 'react';
import { connect } from 'react-redux'

import * as actions from '../actions'
import Async from './Async'
const Balance = Async(() => import('./users/Balance'))
const Address = Async(() => import('./users/Address'))
const UserData = Async(() => import('./users/UserData'))

const Home = () => (
  <div>
    <Address />
    <Balance />
    <UserData />
  </div>
)

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(Home)
