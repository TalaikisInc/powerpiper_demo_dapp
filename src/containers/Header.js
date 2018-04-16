import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import * as actions from '../actions'
import Tabs  from 'grommet/components/Tabs'
import Tab  from 'grommet/components/Tab'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOwner: null
    }
  }

  componentDidMount() {
    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.validate(this.props.account)
        .then((res) => {
          this.setState({
            isOwner: res
          })
        })
    })
  }

  render () {
    return (
      <Tabs responsive={true} justify='center'>
        <Tab title='Home'>
          <Redirect to='/help' />
        </Tab>
        <Tab title='Market Info'>
          <Redirect to='/market-info' />
        </Tab>
        <Tab title='ICO'>
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
        { this.state.isOwner &&
        <Tab title='Admin'>
          <Redirect to='/admin' />
        </Tab>
        }
      </Tabs>
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

export default connect(mapStateToProps, actions)(Header)
