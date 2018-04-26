import React, { Component } from 'react'
import { connect } from 'react-redux'

import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import List from 'grommet/components/List'
import ListItem  from 'grommet/components/ListItem'
import Image from 'grommet/components/Image'
import Button from 'grommet/components/Button'

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
    this.getUsersCount = this.getUsersCount.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
  }

  componentDidMount() {
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

  getUsers() {
    if (this.state.userCount > 0) {
      let userData = []
      this.props.Token.deployed().then(async (token) => {
        for (let i = 0; i < this.state.userCount; i++) {
          token.getUserAtIndex(i, { from: this.props.account }).then(async (res) => {
            const _decryptedHash = await decrypt(res[2], process.env.REACT_APP_HASH_PASS)
            this.props.ipfs.catJSON(_decryptedHash, async (err, data) => {
              const _obj = JSON.parse(await decrypt(await decrypt(data, res[1]), process.env.REACT_APP_ENCRYPTION_PASS))
              if (!err) {
                userData.push(_obj)
                this.setState({
                  users: userData
                })
              } else {
                console.log('getUsers', err)
              }
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

    for (let i = 0; i < users.length; i++) {
      usersRendered.push(
        <div>
          <List>
            <ListItem>
              <Box pad='medium' align='top'>
                Email:
              </Box>
              <Box pad='medium' align='top'>
                <p>{ users[i].email }</p>
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='top'>
              Name:
              </Box>
              <Box pad='medium' align='top'>
                <p>{ users[i].firstName } { users[i].lastName }</p>
                <p>{ users[i].docType } { users[i].docNo }</p>
                { users[i].idDocument ?
                 <p><Image src={users[i].idDocument} /></p>
                  : ''
                }
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='top'>
                Address:
              </Box>
              <Box pad='medium' align='top'>
                <p>{ users[i].address } { users[i].city } { users[i].country }</p>
                { users[i].addressDocument ?
                  <p><Image src={users[i].addressDocument} /></p>
                  : ''
                }
              </Box>
            </ListItem>
            <ListItem>
              <Box pad='medium' align='top'>
                Phone:
              </Box>
              <Box pad='medium' align='top'>
                <p>{ users[i].phone }</p>
              </Box>
            </ListItem>
          </List>
          <Box pad='medium' align='top'>
            <Button primary={true} type='submit' label='Add to whitelist' />
          </Box>
          <Box pad='medium' align='top'>
            <Button primary={true} type='submit' label='Remove from whitelist' />
          </Box>
          <hr />
        </div>
      )
    }

    return (
      <Box align='center'>
        <Heading>Users</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>

        { usersRendered }
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
