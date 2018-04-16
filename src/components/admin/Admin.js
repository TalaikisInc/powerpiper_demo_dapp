import React, { Component } from 'react'
import { connect } from 'react-redux'
import Box  from 'grommet/components/Box'
import Heading  from 'grommet/components/Heading'
import Label  from 'grommet/components/Label'

class Admin extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Box>
        <Heading>Admin Area</Heading>
        <Label>This area is admins'.</Label>
      </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
    //Token: state.Token,
    //Crowdsale: state.Crowdsale,
    account: state.account,
    web3: state.web3
  }
}

export default connect(mapStateToProps)(Admin)
