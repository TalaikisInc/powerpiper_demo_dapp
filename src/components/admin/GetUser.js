import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

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
import env from '../../env'

class GetUser extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      userCount: '',
      user: '',
      userId: '',
      email: '',
      firstName: '',
      lastName: ''
    }

    this.handleIDSubmit = this.handleIDSubmit.bind(this)
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
  }

  componentDidMount() {
    this.getUsersCount()
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

  handleChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState({
      [name]: value
    })
  }

  handleIDSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if(this.state.userId >= 0) {
        token.getUserAtIndex(this.state.userId, { from: this.props.account })
          .then((res) => {
            this.props.ipfs.catJSON(res[2], async (err, data) => {
              if(err) {
                // console.log(err)
                this.setState({
                  modalOpen: true,
                  failure: `Error occured: ${err.message}`
                })
              } else {
                const _obj = JSON.parse(await decrypt(data, env.ENCRYPTION_PASSWORD))
                this.setState({
                  user: res[1],
                  email: _obj.email,
                  firstName: _obj.firstName,
                  lastName: _obj.lastName
                })
              }
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
  }

  handleAddressSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if(web3utils.isAddress(this.state.user)) {
        token.getUser(this.state.user, { from: this.props.account }).then((res) => {
            this.props.ipfs.catJSON(res[1], async (err, data) => {
              if(err) {
                // console.log(err)
                this.setState({
                  modalOpen: true,
                  failure: `Error occured: ${err.message}`
                })
              } else {
                const _obj = JSON.parse(await decrypt(data, env.ENCRYPTION_PASSWORD))
                this.setState({
                  userId: res[0].toNumber(),
                  user: this.state.user,
                  email: _obj.email,
                  firstName: _obj.firstName,
                  lastName: _obj.lastName
                })
              }
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
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Get User</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>

        <Table>
          <TableHeader labels={['ID', 'Address', 'Email', 'First name', 'Last name']} sortIndex={0} />
          <tbody>
            <TableRow>
              <td>{ this.state.userId ? this.state.userId : '' }</td>
              <td>{ this.state.user ? this.state.user : '' }</td>
              <td>{ this.state.email ? this.state.email : '' }</td>
              <td>{ this.state.firstName ? this.state.firstName : '' }</td>
              <td>{ this.state.lastName ? this.state.lastName : '' }</td>
            </TableRow>
          </tbody>
        </Table>

        <Form onSubmit={this.handleIDSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="userId">By ID:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='userId'
              type='number'
              step='1'
              onDOMChange={this.handleChange}
              value={this.state.userId}
              name='userId'
              placeHolder='User ID'/>
          </Box>
          <Box pad='small' align='center'>
            <Button primary={true} type='submit' label='Get' />
          </Box>
        </Form>
        <Form onSubmit={this.handleAddressSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="address">By Address:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='address'
              type='text'
              onDOMChange={this.handleChange}
              value={this.state.user}
              name='user'
              placeHolder='User Address'/>
          </Box>
          <Box pad='small' align='center'>
            <Button primary={true} type='submit' label='Get' />
          </Box>
        </Form>
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
    account: state.account
  }
}

export default connect(mapStateToProps)(GetUser)
