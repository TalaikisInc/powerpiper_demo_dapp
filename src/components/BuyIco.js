import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'
import BuyIcoTokens from './BuyIcoTokens'
// import Redeem from './Redeem'
// import RecentTransactions from './RecentTransactions'

const BuyICO = () => (
  <div>
    { /*
    <Redeem /> 
    */ }
    <BuyIcoTokens />
    { /*
    <RecentTransactions />
    */ }
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

export default connect(mapStateToProps, actions)(BuyICO)
