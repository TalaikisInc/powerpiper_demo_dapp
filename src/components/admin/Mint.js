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

class Mint extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      percentage: '',
      supply: '',
      amount: '',
      status: null
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getTotalSupply = this.getTotalSupply.bind(this)
    this.getMintStatus = this.getMintStatus.bind(this)
  }

  componentDidMount() {
    this.getTotalSupply()
    this.getMintStatus()
  }

  getMintStatus() {
    this.props.Token.deployed().then(async (token) => {
      token.mintingFinished().then((res) => {
        this.setState({
          status: res.toString()
        })
      })
    })

    setTimeout(() => {
      this.getMintStatus()
    }, 2000)
  }

  getTotalSupply() {
    this.props.Token.deployed().then(async (token) => {
      token.totalSupply().then((res) => {
        this.setState({
          supply: res ? res.toNumber() : 'N/A'
        })
      })
    })

    setTimeout(() => {
        this.getTotalSupply()
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

  handleSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if (this.state.amount > 0 && this.state.status === false) {
        const _gas = await token.mint.estimateGas(token.address, this.state.amount * 10 ** env.DECIMALS)
        token.mint(token.address, this.state.amount * 10 ** env.DECIMALS, {
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
          failure: `Either form isn't filled up or minting is finished.`
        })
      }
    })
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Mint tokens</Heading>
        <Label>Current supply is { this.state.supply / 10 ** env.DECIMALS }</Label>
        <Label>Minting finished: { this.state.status }</Label>
        <Form onSubmit={this.handleSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="mintAmount">How much to mint:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='mintAmount'
              step='1'
              type='number'
              onDOMChange={this.handleChange}
              value={this.state.amount}
              name='amount'
              placeHolder='Amount to mint'/>
          </Box>
          <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Mint' />
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

export default connect(mapStateToProps)(Mint)
