import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'
import BuyDirect from './BuyDirect'
import Redeem from './Redeem'
import RecentTransactions from './RecentTransactions'

const BuyRedeem = () => (
  <div>
    <Redeem />
    <BuyDirect />
    <RecentTransactions />
  </div>
)

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(BuyRedeem)
