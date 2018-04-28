import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import TableHeader from 'grommet/components/TableHeader'
import TableRow from 'grommet/components/TableRow'
import Table  from 'grommet/components/Table'
import Toast from 'grommet/components/Toast'

import env from '../../env'

/*
@TODO full rating system: 1) count obs, 2) sort, 3) get pos.
*/
class PublicUserList extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      userCount: 0,
      users: [],
      balance: ''
    }

    this.getUsers = this.getUsers.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
    this.getBalance = this.getBalance.bind(this)
  }

  async componentDidMount() {
    this.getUsersCount()
    this.getUsers()
  }

  getUsersCount() {
    this.props.Token.deployed().then(async (token) => {
      token.getUserCount().then((res) => {
        this.setState({
          userCount: res ? res.toNumber() : 0
        })
      })
    })

    setTimeout(() => {
        this.getUsersCount()
    }, 2000)
  }

  getBalance(from) {
    if(web3utils.isAddress(from)) {
      this.props.Crowdsale.deployed().then((crowdsale) => {
        crowdsale.balanceOf(from).then((tokenBalance) => {
          this.setState({
            balance: tokenBalance ? tokenBalance.toNumber() : ''
          })
        })
      })
    }

    setTimeout(() => {
      this.getBalance()
    }, 2000)
  }

  getUsers() {
    if (this.state.userCount > 0) {
      let userData = []
      this.props.Token.deployed().then(async (token) => {
        for (let i = 0; i < this.state.userCount; i++) {
          token.getUserPublic(i).then(async (res) => {
            this.getBalance(res)
            userData.push({
              user: res,
              balance: this.state.balance !== '' ? this.state.balance / 10 ** env.DECIMALS : ''
            })
            this.setState({
              users: userData
            })
          })
        }
      })
    }

    setTimeout(() => {
      this.getUsers()
    }, 2000)
  }

  render() {
    let users = this.state.users
    const usersRendered = []
    let totals = 0

    for (let i = 0; i < users.length; i++) {
      totals += users[i].balance
      usersRendered.push(
        <TableRow key={i}>
          <td>{ users[i].user }</td>
          <td>{ users[i].balance / totals }</td>
        </TableRow>
      )
    }

    return (
      <Box align='center'>
        <Heading>Users</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>
        <Table>
        <TableHeader labels={['User', 'Rating']} sortIndex={0} sortAscending={true} />
          <tbody>
            { usersRendered }
          </tbody>
        </Table>
        { this.state.modalOpen && <Toast
          status={this.state.success ? 'ok' : 'critical' }>
            <p>{ this.state.success ? this.state.success : null }</p>
            <p>{ this.state.failure ? this.state.failure : null }</p>
          </Toast>
        }
      </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    ipfs: state.ipfs,
    Token: state.Token,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps)(PublicUserList)
