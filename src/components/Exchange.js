import React from 'react';
import { connect } from 'react-redux'

import Box  from 'grommet/components/Box'
import Label  from 'grommet/components/Label'

const Exchange = () => (
  <Box align='center'>
    <Label>In development.</Label>
  </Box>
)

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps)(Exchange)
