import React from 'react'
import { connect } from 'react-redux'
import Heading from 'grommet/components/Heading'
import List from 'grommet/components/List'
import ListItem  from 'grommet/components/ListItem'

const Address = (props) => (
  <div>
    <Heading>Your Address</Heading>
    <List>
      <ListItem>{ props.account }</ListItem>
    </List>
  </div>
)

function mapStateToProps(state) {
  return {
    web3: state.web3,
    account: state.account
  }
}

export default connect(mapStateToProps)(Address)
