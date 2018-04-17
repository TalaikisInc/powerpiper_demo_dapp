import React, { Component } from 'react'
import { connect } from 'react-redux'
import validator from 'validator'

import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'

import { encrypt } from '../utils/crypto'
import env from '../env'

class AddUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountEth: '',
      amountTokens: null,
      priceEth: null,
      success: '',
      failure: '',
      email: '',
      firstName: '',
      lastName: '',
      modalOpen: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const { target } = event
    const { name } = target

    this.setState({
      [name]: target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if (validator.isEmail(this.state.email) && this.state.firstName != null && this.state.lastName != null) {

        const _data = {
          email: await encrypt(this.state.email, env.ENCRYPTION_PASSWORD),
          firstName: await encrypt(this.state.firstName, env.ENCRYPTION_PASSWORD),
          lastName: await encrypt(this.state.lastName, env.ENCRYPTION_PASSWORD)
        }

        this.props.ipfs.addJSON(_data, (err, _hash) => {
          if (err) {
            this.setState({
              failure: `Error occured: ${err.message}`
            })
          } else {
            token.newUser(_hash, {
              from: this.props.account,
              gas: 300000
            })
              .then((receipt) => {
                this.setState({
                  modalOpen: true,
                  success: `Success! Your tx: ${receipt.tx}`
                })
              })
              .catch((err) => {
                this.setState({
                  modalOpen: true,
                  failure: `Error occured: ${err.message}`
                })
              })
          }
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: `Please check the form, all fields are required`
        })
      }
    })

  }

  render() {
    return (
      <Box align='center'>
        <Heading>Register</Heading>
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="email">Email:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='email'
                type='text'
                name='email'
                onDOMChange={this.handleChange}
                value={this.state.email}
                placeHolder='Email' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="firstName">First name:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='firstName'
                type='text'
                name='firstName'
                onDOMChange={this.handleChange}
                value={this.state.firstName}
                placeHolder='First name' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="lastName">Last name:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='lastName'
                type='text'
                name='lastName'
                onDOMChange={this.handleChange}
                value={this.state.lastName}
                placeHolder='Last name' />
            </Box>
            <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Register' />
            </Box>
          </Form>
        </Box>
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
    Token: state.Token,
    account: state.account,
    web3: state.web3,
    ipfs: state.ipfs
  }
}

export default connect(mapStateToProps)(AddUser)
