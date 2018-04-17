import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import '../../node_modules/grommet-css'
import App from 'grommet/components/App'
import Box from 'grommet/components/Box'

import * as actions from '../actions'
import Header from '../containers/Header'
import Footer from '../containers/Footer'
import Status from './Status'
import Home from './Home'
import Help from './Help'
import BuyIcoTokens from './BuyIcoTokens'
import CoinStats from './CoinStats'
import TransferTokens from './TransferTokens'
import Admin from './admin/Admin'
import PriceMarkup from './admin/PriceMarkup'
import Fee from './admin/Fee'
import TransferOwnership from './admin/TransferOwnership'
import ReclaimTokens from './admin/ReclaimTokens'
import FinishMinting from './admin/FinishMinting'
import Mint from './admin/Mint'
import Approve from './admin/Approve'
import RemoveFromWhitelist from './admin/RemoveFromWhitelist'
import AddToWhitelist from './admin/AddToWhitelist'
import UserList from './admin/UserList'
import AddUser from './AddUser'

class _App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initiated: false,
      deployed: true
    }
  }

  componentDidMount() {
    this.props.initWeb3()

    setInterval(() => {
      this.props.fetchAccount(this.props.web3)
    }, 2000)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.web3 !== nextProps.web3) {
      this.props.fetchAccount(this.props.web3)
      this.props.initIPFS(this.props.web3)

      this.setState({
        initiated: true
      })

      if (nextProps.web3.web3Initiated) {
        this.props.initToken(nextProps.web3)
        this.props.initCrowdsale(nextProps.web3)
      }
    }

    if (this.props.account !== nextProps.account && typeof nextProps.account === 'string') {
      this.setState({
        initiated: true
      })
    }

    /* @TODO add other tokens! */
    if (this.props.Crowdsale !== nextProps.Crowdsale) {
      nextProps.Crowdsale.deployed()
        .then(() => {
          this.setState({
            deployed: true
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({
            deployed: false
          })
        })
    }
  }

  render() {
    return (
      <App>
        <div>
          <BrowserRouter>
            <div>
              <Box align='center' responsive={true} pad='large'>
                { this.state.deployed && typeof this.props.account === 'string' && this.props.account !== 'empty'
                  ? <div>
                      <Box align='center' responsive={true} pad='medium'>
                        <Header />
                        <Status
                          account={this.props.account}
                          metamask={this.props.web3}
                          initiated={this.state.initiated}
                          deployed={this.state.deployed} {...this.props} />
                      </Box>
                      <Route exact path='/help' component={Help} />
                      <Route exact path='/account' component={Home} />
                      <Route exact path='/ico' component={BuyIcoTokens} />
                      <Route exact path='/market-info' component={CoinStats} />
                      <Route exact path='/transfer' component={TransferTokens} />
                      <Route exact path='/admin' component={Admin} />
                      <Route exact path='/markup' component={PriceMarkup} />
                      <Route exact path='/fee' component={Fee} />
                      <Route exact path='/transfer-ownership' component={TransferOwnership} />
                      <Route exact path='/reclaim-tokens' component={ReclaimTokens} />
                      <Route exact path='/approve' component={Approve} />
                      <Route exact path='/finish-mint' component={FinishMinting} />
                      <Route exact path='/mint' component={Mint} />
                      <Route exact path='/whitelist-remove' component={RemoveFromWhitelist} />
                      <Route exact path='/whitelist-add' component={AddToWhitelist} />
                      <Route exact path='/users' component={UserList} />
                      <Route exact path='/register' component={AddUser} />
                    </div>
                  : null
                }
              </Box>
              <Footer />
            </div>
          </BrowserRouter>
        </div>
      </App>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(_App)
