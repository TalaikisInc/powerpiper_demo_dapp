import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Tabs from 'grommet/components/Tabs'
import Tab from 'grommet/components/Tab'

class Admin extends Component {
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

  render() {
    return (
      <div>
        { this.state.isOwner
          ? <Box>
              <Heading>Admin Area</Heading>
              <Tabs responsive={true} justify='center'>
                <Tab title='Ownership transfer'>
                  <Redirect to='/transfer-ownership' />
                </Tab>
                <Tab title='Fees'>
                  <Redirect to='/fees' />
                </Tab>
                <Tab title='Reclaim tokens'>
                  <Redirect to='/reclaim-tokens' />
                </Tab>
              </Tabs>
              <Label>This area is admin area</Label>
              { /*
              <CrowdsaleCreationAdmin />
              <Approve />
              <Finalization />
              <Redeems />
              <Certificates />
              <TokenAvailability />
              */ }
          </Box>
          : <Label>This area is admin only</Label>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    // Token: state.Token,
    Crowdsale: state.Crowdsale,
    // Exchange: state.Exchange,
    account: state.account
  }
}

export default connect(mapStateToProps)(Admin)
