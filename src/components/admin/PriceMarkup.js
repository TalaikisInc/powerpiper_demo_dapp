import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd'

class PriceMarkupAdmin extends Component {
  constructor() {
    super()
    this.state = {
      percentage: null,
      messages: null
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

    this.props.Token.deployed().then((token) => {
      token.setPriceMarkup(
        this.state.percentage * 1000,
        {
          from: this.props.account,
          gas: 300000
        },
      ).then((receipt) => {
        console.log('Success: ', receipt)
        this.setState({
          messages: `Price markup set and used ${receipt.receipt.cumulativeGasUsed} of gas.`
        })
      }).catch((error) => {
        console.log(error.message)
        this.setState({
          messages: error.message
        })
      })
    })
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Input
            type='number'
            onChange={this.handleChange}
            value={this.state.percentage}
            name='percentage'
            placeholder='Percentage over spot energy price'
          />
          <Button
            type='primary'
            htmlType='submit'
          >Set percentage over spot energy price
          </Button>
        </Form>
        { this.state.messages }
      </div>
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

export default connect(mapStateToProps)(PriceMarkupAdmin)
