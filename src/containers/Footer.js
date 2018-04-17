import React from 'react';
import { connect } from 'react-redux'
import * as actions from '../actions'
import Box from 'grommet/components/Box'
import Paragraph from 'grommet/components/Paragraph'

const Footer = () => (
  <Box align='center'>
    <Paragraph>&copy; 2018, <a href="https://powerpiper.com">PowerPiper</a></Paragraph>
  </Box>
)

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps, actions)(Footer)
