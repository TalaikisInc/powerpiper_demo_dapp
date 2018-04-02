import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd'

class SilverPriceMarkupAdmin extends Component {
  constructor() {
    super();
    this.state = {
      percentage: null
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

    this.props.Exchange.deployed().then((exchange) => {
      exchange.setPriceMarkup(
        this.state.percentage * 1000,
        {
          from: this.props.account,
          gas: 300000
        },
      ).then((receipt) => {
        console.log('Success: ', receipt)
      }).catch((error) => {
        console.log(error.message)
      })
    })
  }

  render() {
    return (
      <div>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <Input
              type="number"
              onChange={this.handleChange}
              value={this.state.percentage}
              name="percentage"
              placeholder="Percentage over spot energy price"
              style={{ marginTop: 10 }}
            />
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: 10, marginBottom: 30 }}
            >Set percentage over spot silver price
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Exchange: state.Exchange,
    account: state.account
  }
}

export default connect(mapStateToProps)(SilverPriceMarkupAdmin)
