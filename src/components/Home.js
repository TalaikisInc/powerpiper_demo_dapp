 import React from 'react';
import { connect } from 'react-redux'

import * as actions from '../actions'
import Balance from './Balance'
import Address from './Address'
import User from './User'

const Home = () => (
  <div>
    <Address />
    <Balance />
    <User />
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
