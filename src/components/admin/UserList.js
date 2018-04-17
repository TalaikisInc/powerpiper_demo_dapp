import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
// import TextInput from 'grommet/components/TextInput'
// import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
// import Form  from 'grommet/components/Form'
// import web3utils from 'web3-utils'

/*
TODO!!!! rendering, ipfs  data request, decoding
*/
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

    //this.handleSubmit = this.handleSubmit.bind(this)
    //this.handleChange = this.handleChange.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
  }

  componentDidMount() {
    this.getUsers()
    this.getUsersCount()
  }

  getUsers() {
    this.props.Token.deployed().then(async (token) => {
      let _users = []
      for (let i = 0; i < this.state.userCount; i++) { 
        token.getUserAtIndex(i, { from: this.props.account }).then((res) => {
          _users[_users.length] = res
        })

        this.setState({
          users: _users
        })
      }
    })

    setTimeout(() => {
        this.getUsers()
    }, 2000)
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

  /*handleChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.Crowdsale.deployed().then(async (token) => {
      if(web3utils.isAddress(this.state.toWhitelist)) {
        token.removeFromWhitelist(this.state.toWhitelist, {
          from: this.props.account,
          gas: 300000
        })
        .then((receipt) => {
          // console.log('Success: ', receipt)
          this.setState({
            modalOpen: true,
            success: `Success! Your tx: ${receipt.tx}`
          })
        })
        .catch((error) => {
          // console.log(error.message)
          this.setState({
            modalOpen: true,
            failure: `Error occured: ${error.message}`
          })
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: 'Please check the form.'
        })
      }
    })
  }*/

  render() {
    return (
      <Box align='center'>
        <Heading>Users</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>
        <ul>
            { this.state.users.map(function(index, name) {
                    return <li key={ index }>{ name }</li>
                  })}
            </ul>
        { /*
        <Form onSubmit={this.handleSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="whitelist">Whom to remove:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='whitelist'
              type='text'
              onDOMChange={this.handleChange}
              value={this.state.toWhitelist}
              name='toWhitelist'
              placeHolder='Address'/>
          </Box>
          <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Save' />
          </Box>
        </Form>
        */ }
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
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(UserList)
