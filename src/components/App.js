import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import '../../node_modules/grommet-css'
import * as actions from '../actions'
import Header from '../containers/Header'
import Status from './Status'
import Home from './Home'
import Admin from './admin/Admin'
import BuyIcoTokens from './BuyIcoTokens'
import Checkbox from './Checkbox'
import CoinStats from './CoinStats'
import Exchange from './Exchange'
import Transfer from './TransferTokens'

class App extends Component {
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

      this.setState({
        initiated: true
      })

      if (nextProps.web3.web3Initiated) {
        this.props.initToken(nextProps.web3)
        this.props.initExchange(nextProps.web3)
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
          console.log(err)
          this.setState({
            deployed: false
          })
        })
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Status account={this.props.account} metamask={this.props.web3} initiated={this.state.initiated} deployed={this.state.deployed} {...this.props} />
          <Header />
          <div>
            <Route exact path='/' component={Checkbox} />
            { typeof this.props.Token === 'function' && typeof this.props.Crowdsale === 'function' &&
              this.state.deployed && typeof this.props.account === 'string' && this.props.account !== 'empty'
              ? <div>
                <Route exact path='/app' component={Home} />
                <Route exact path='/ico' component={BuyIcoTokens} />
                <Route exact path='/market-info' component={CoinStats} />
                <Route exact path='/transfer' component={Transfer} />
                <Route exact path='/exchange' component={Exchange} />
                <Route exact path='/admin' component={Admin} />
              </div>
              : null
            }
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    Token: state.Token,
    Exchange: state.Exchange,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(App)
