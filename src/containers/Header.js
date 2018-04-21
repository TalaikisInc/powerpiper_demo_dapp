import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import Tabs  from 'grommet/components/Tabs'
import Tab  from 'grommet/components/Tab'
import Box  from 'grommet/components/Box'
import Label  from 'grommet/components/Label'

import * as actions from '../actions'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOwner: null
    }
  }

  componentDidMount() {
    if(this.props.Crowdsale) {
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
  }

  render () {
    return (
      <div>
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
                  <Redirect to='/users' />
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
            </Tabs>
          </Box>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(Header)
