import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'
import gzip from 'gzip-js'

import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import Table  from 'grommet/components/Table'
import TableHeader  from 'grommet/components/TableHeader'
import TableRow  from 'grommet/components/TableRow'

import { decrypt } from '../../utils/crypto'

class UserList extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      userCount: '',
      users: []
    }

    this.getUsers = this.getUsers.bind(this)
    this.getUsers2 = this.getUsers2.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
  }

  componentDidMount() {
    this.getUsersCount()
    this.getUsers()
    this.getUsers2()
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

  getUsers() {
    this.props.Token.deployed().then(async (token) => {
      const evenet = token.NewUser({},{fromBlock: 0, toBlock: 'latest'})
      event.get((error, result) => {
        if(!error) {
          console.log('user register events')
          console.log(result)
        }
      })
    })
  }

  getUsers2() {
    if (this.state.userCount > 0) {
      let userData = []
      this.props.Token.deployed().then(async (token) => {
        for (let i = 0; i < this.state.userCount; i++) {
          token.getUserAtIndex(i, { from: this.props.account }).then(async (res) => {
            const _decryptedHash = await decrypt(res[2], process.env.REACT_APP_HASH_PASS)
            this.props.ipfs.catJSON(gzip.unzip(_decryptedHash), async (err, data) => {
              if (!err) {
                userData.push({
                  email: data[0],
                  firstName: data[1],
                  lastName: data[2]
                })
                this.setState({
                  users: userData
                })
              }
            })
          })
        }
      })
    }
  }

  render() {
    let users = this.state.users
    const usersRendered = []

    for (var i = 0; i < users.length; i++) {
      usersRendered.push(
        <TableRow>
          <td>{ users[i].email }</td>
          <td>{ users[i].firstName }</td>
          <td>{ users[i].lastName }</td>
        </TableRow>
      )
    }

    return (
      <Box align='center'>
        <Heading>Get User</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>

        <Table>
          <TableHeader labels={['Email', 'First name', 'Last name']} sortIndex={0} />
          <tbody>
            { usersRendered }
          </tbody>
        </Table>
      </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    ipfs: state.ipfs,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(UserList)
