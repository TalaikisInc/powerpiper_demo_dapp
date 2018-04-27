import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Redirect } from 'react-router'

import '../../node_modules/grommet-css'
import App from 'grommet/components/App'
import Box from 'grommet/components/Box'
import Label  from 'grommet/components/Label'
import Tabs  from 'grommet/components/Tabs'
import Tab  from 'grommet/components/Tab'
import ReactGA from 'react-ga'

import * as actions from '../actions'
import Footer from './Footer'
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
import GetUser from './admin/GetUser'
import UserList from './admin/UserList'
import AddUser from './users/AddUser'
import PublicUserList from './users/PublicUserList'
import UpdateUser from './users/UpdateUser'
import DeleteUser from './users/DeleteUser'
import Exchange from './Exchange'
import NoMatch from './NoMatch'
import env from '../env'
ReactGA.initialize(env.GA)

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
    this.validateAdmin()

    setInterval(() => {
      this.props.fetchAccount(this.props.web3)
      this.props.fetchGasPrice(this.props.web3)
    }, 2000)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.web3 !== nextProps.web3) {
      this.props.fetchAccount(this.props.web3)
      this.props.fetchGasPrice(this.props.web3)
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

    if (this.props.Crowdsale !== nextProps.Crowdsale) {
      nextProps.Crowdsale.deployed()
        .then(() => {
          this.setState({
            deployed: true
          })
        })
        .catch((err) => {
          // console.log('App err', err)
          this.setState({
            deployed: false
          })
        })
    }
  }

  validateAdmin() {
    if(this.state.deployed && typeof this.props.account === 'string' && this.props.account !== 'empty') {
      this.props.Crowdsale.deployed().then(async (crowdsale) => {
        crowdsale.validate({ from: this.props.account }).then((res) => {
          this.setState({
            isOwner: res
          })
        })
      })
    } else {
      this.setState({
        isOwner: false
      })
    }

    setTimeout(() => {
      this.validateAdmin()
    }, 2000)
  }

  pageviewTracking() {
    ReactGA.pageview(window.location.hash)
  }

  render() {
    return (
      <App>
        <div>
          <BrowserRouter onUpdate={this.pageviewTracking}>
            <div>
              <Box align='center' responsive={true} pad='large'>
                <Status
                  account={this.props.account}
                  metamask={this.props.web3}
                  initiated={this.state.initiated}
                  deployed={this.state.deployed} {...this.props} />
                <Box align='center' responsive={true} pad='medium'>
                  { this.state.isOwner
                    ? <Box>
                      <Label align='center'>Crowdsale:</Label>
                        <Tabs responsive={true} justify='center'>
                          <Tab title='Home'>
                            <Redirect to='/admin' />
                          </Tab>
                          <Tab title='Ownership'>
                            <Redirect to='/transfer-ownership' />
                          </Tab>
                          <Tab title='Reclaim'>
                            <Redirect to='/reclaim-tokens' />
                          </Tab>
                          <Tab title='Approval'>
                            <Redirect to='/approve' />
                          </Tab>
                          <Tab title='Wh. add'>
                            <Redirect to='/whitelist-add' />
                          </Tab>
                          <Tab title='Wh. remove'>
                            <Redirect to='/whitelist-remove' />
                          </Tab>
                        </Tabs>
                        <Label align='center'>Token:</Label>
                        <Tabs responsive={true} justify='center'>
                          <Tab title='Markup'>
                            <Redirect to='/markup' />
                          </Tab>
                          <Tab title='Fee'>
                            <Redirect to='/fee' />
                          </Tab>
                          <Tab title='Mint'>
                            <Redirect to='/mint' />
                          </Tab>
                          <Tab title='Finish mint'>
                            <Redirect to='/finish-mint' />
                          </Tab>
                          <Tab title='Users'>
                            <Redirect to='/users-admin' />
                          </Tab>
                          <Tab title='Get User'>
                            <Redirect to='/get-user' />
                          </Tab>
                        </Tabs>
                        { /*
                        <Redeems />
                        <Certificates />
                        <TokenAvailability />
                        */ }
                    </Box>
                    : <Box>
                      <Tabs responsive={true} justify='center'>
                        <Tab title='Home'>
                          <Redirect to='/help' />
                        </Tab>
                        <Tab title='Market Info'>
                          <Redirect to='/market-info' />
                        </Tab>
                        <Tab title='Register'>
                          <Redirect to='/register' />
                        </Tab>
                        <Tab title='Buy tokens'>
                          <Redirect to='/ico' />
                          </Tab>
                        <Tab title='Exchange'>
                        <Redirect to='/exchange' />
                        </Tab>
                        <Tab title='Send'>
                          <Redirect to='/transfer' />
                        </Tab>
                        <Tab title='My account'>
                          <Redirect to='/account' />
                        </Tab>
                        <Tab title='Users'>
                          <Redirect to='/users' />
                        </Tab>
                      </Tabs>
                    </Box>
                  }
                </Box>
                <Route exact path='/help' component={Help} />

                { this.state.deployed && typeof this.props.account === 'string' && this.props.account !== 'empty'
                  ? <div>
                      <Switch>
                      <Route exact path='/account' component={Home} />
                      <Route exact path='/ico' component={BuyIcoTokens} />
                      <Route exact path='/market-info' component={CoinStats} />
                      <Route exact path='/transfer' component={TransferTokens} />
                      <Route exact path='/register' component={AddUser} />
                      <Route exact path='/edit-profile' component={UpdateUser} />
                      <Route exact path='/delete-profile' component={DeleteUser} />
                      <Route exact path='/exchange' component={Exchange} />
                      <Route exact path='/users' component={PublicUserList} />

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
                      <Route exact path='/get-user' component={GetUser} />
                      <Route exact path='/users-admin' component={UserList} />

                      <Route exact path="*" component={NoMatch} />
                      </Switch>
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
    Crowdsale: state.Crowdsale,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(_App)
