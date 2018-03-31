import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions'
import Header from '../containers/Header'
import Status from './Status'
import Home from './Home'
import Admin from './Admin'
import BuyRedeem from './BuyRedeem'
import Checkbox from './Checkbox'

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
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.web3 !== nextProps.web3) {
      this.props.fetchAccount(this.props.web3)
      this.setState({ initiated: true })

      if (nextProps.web3.web3Initiated) {
        this.props.initToken(nextProps.web3)
        this.props.initCrowdsale(nextProps.web3)
      }
    }

    if (this.props.account !== nextProps.account && typeof nextProps.account === 'string') {
      this.setState({ initiated: true })
    }

    if (this.props.Token !== nextProps.Token) {
      nextProps.Token.deployed()
        .then(() => {
          this.setState({ deployed: true })
        })
        .catch((err) => {
          console.log(err)
          this.setState({ deployed: false })
        })
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Status 
            account={this.props.account}
            metamask={this.props.web3}
            initiated={this.state.initiated}
            deployed={this.state.deployed}
            {...this.props} />
          <Header />
          <div>
            <Route exact path='/' component={Checkbox} />
            { typeof this.props.Token === 'function' && typeof this.props.Crowdsale === 'function' &&
              this.state.deployed && typeof this.props.account === 'string' && this.props.account !== 'empty'
              ? <div>
                <Route exact path='/app' component={Home} />
                <Route exact path='/buy-redeem' component={BuyRedeem} />
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
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(App)
