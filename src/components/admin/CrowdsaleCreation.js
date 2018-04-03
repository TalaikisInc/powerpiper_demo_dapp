import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd'

class CrowdsaleCreationAdmin extends Component {
  constructor() {
    super()
    this.state = {
      openingTime: Date.now(),
      closingTime: null,
      rate: 1000,
      cap: 10,
      goal: 1
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
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

    const _token = this.props.Token.deployed().then((token) => {
      token.new({
        from: this.props.account,
        gas: 5000000
      })
        .then((receipt) => {
          console.log('Token creation success: ', receipt)
        }).catch((error) => {
          console.log(error.message)
        })
    })

    const _vault = this.props.Vault.deployed().then((token) => {
      token.new({
        from: this.props.account,
        gas: 5000000
      })
        .then((receipt) => {
          console.log('Vault creation success: ', receipt)
        }).catch((error) => {
          console.log(error.message)
        })
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.new(
        this.state.openingTime,
        this.state.closingTime,
        this.state.rate,
        this.statecap,
        this.props.account,
        _token,
        this.state.goal,
        {
          from: this.props.account,
          gas: 5000000
        }
      )
        .then(() => {
          return _token.transferOwnership(this.props.account)
        })
        .then(() => {
          _vault.transferOwnership(this.props.account)
        })
        .then((receipt) => {
          console.log('Crowdsale creation success: ', receipt)
        })
        .catch((error) => {
          console.log(error.message)
        })
    })
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
        Start time
          <Input type='number' onChange={this.handleChange} value={this.state.openingTime} name='openingTime' placeholder='Opening time' />
        End time
          <Input type='number' onChange={this.handleChange} value={this.state.closingTime} name='closingTime' placeholder='Closing time' />
        Rate
          <Input type='number' onChange={this.handleChange} value={this.state.rate} name='rate' placeholder='Rate' />
        Cap
          <Input type='number' onChange={this.handleChange} value={this.state.cap} name='cap' placeholder='Cap' />
        Goal
          <Input type='number' onChange={this.handleChange} value={this.state.goal} name='goal' placeholder='Goal' />
          <Button type='primary' htmlType='submit' >
            Create
          </Button>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Token: state.Token,
    Vault: state.Vault,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps)(CrowdsaleCreationAdmin)
