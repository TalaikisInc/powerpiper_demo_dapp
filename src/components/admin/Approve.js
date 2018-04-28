import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

import Box  from 'grommet/components/Box'
import Heading  from 'grommet/components/Heading'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import TextInput  from 'grommet/components/TextInput'
import Toast  from 'grommet/components/Toast'
import Button  from 'grommet/components/Button'

import env from '../../env'

class Approve extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountTokens: '',
      success: '',
      sender: '',
      failure: '',
      loading: false
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

    this.setState({
      success: '',
      failure: '',
      loading: true
    })

    this.props.Crowdsale.deployed().then(async (crowdsale) => {
      const _value = this.state.amountTokens * 10 ** env.DECIMALS
      if(_value > 0 && web3utils.isAddress(this.state.sender)) {
        const _gas = await crowdsale.approve.estimateGas(this.state.sender, _value)
        crowdsale.approve(this.state.sender, _value, {
          from: this.props.account,
          gas: _gas,
          gasPrice: this.props.gasPrice
        })
          .then((receipt) => {
            // console.log('receipt', receipt)
            this.setState({
              modalOpen: true,
              success: `Success! Your tx: ${receipt.tx}`
            })
          }).catch((error) => {
            // console.log(error)
            this.setState({
              modalOpen: true,
              failure: `Error occurred: ${error.message}`
            })
          })
      } else {
        this.setState({
          modalOpen: true,
          failure: `Please check amount or address.`
        })
      }
    })

  }

  render() {
    return (
      <Box align='center'>
        <Heading>Approve token buy</Heading>
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="sender">Who to approve:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput
                type='text'
                id='sender'
                name='sender'
                onChange={this.handleChange}
                value={this.state.sender}
                placeholder='Who to approve' />  
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="amount">Who to approve:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput
                type='number'
                id='amount'
                name='amountTokens'
                onChange={this.handleChange}
                value={this.state.amountTokens}
                placeholder='Tokens to approve' />  
            </Box>
            <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Save' />
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
    Crowdsale: state.Crowdsale,
    account: state.account,
    web3: state.web3,
    gasPrice: state.gasPrice
  }
}

export default connect(mapStateToProps)(Approve)
