import React, { Component } from 'react'
import { connect } from 'react-redux'

import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'

import env from '../../env'

class SetFee extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      percentage: '',
      fee: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getFee = this.getFee.bind(this)
  }

  async componentDidMount() {
    this.getFee()
  }

  handleChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState({
      [name]: value
    })
  }

  getFee() {
    this.props.Token.deployed().then(async (token) => {
      token.fee().then((res) => {
        this.setState({
          fee: res ? res.toNumber() : 'N/A'
        })
      })
    })

    setTimeout(() => {
      this.getFee()
    }, 2000)
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if (this.state.percentage > 0) {
        const _gas = await token.setNewFee.estimateGas(this.state.percentage * 10 ** env.DECIMALS)
        token.setNewFee(this.state.percentage * 10 ** env.DECIMALS, {
          from: this.props.account,
          gas: _gas,
          gasPrice: this.props.gasPrice
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
            failure: `Error occurred: ${error.message}`
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
        <Heading>Set new fee</Heading>
        <Label>Current fee is { this.state.fee / 10 ** env.DECIMALS }</Label>
        <Form onSubmit={this.handleSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="fee">New fee:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='fee'
              step='1'
              type='number'
              onDOMChange={this.handleChange}
              value={this.state.percentage}
              name='percentage'
              placeHolder='Percentage, e.g. 1'/>
          </Box>
          <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Set' />
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
    Token: state.Token,
    account: state.account,
    gasPrice: state.gasPrice
  }
}

export default connect(mapStateToProps)(SetFee)
