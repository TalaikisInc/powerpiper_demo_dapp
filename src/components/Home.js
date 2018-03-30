// import React from 'react';
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import * as actions from '../actions'

/*import Balance from './Balance';
import Address from './Address';
import CoinStats from './CoinStats';
import RecentTransactions from './RecentTransactions';
import Certificates from './Certificates';
*/

const Home = () => (
  {
      /*<CoinStats />
    <Link href="/buy-redeem" to="/buy-redeem" id="buy-redeem-link" className="ant-btn ant-btn-primary">
        Buy and Redeem
    </Link>
    <Address />
    <Balance />
    <Certificates />
    <RecentTransactions /> */
  }
)

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(Home)
