/*import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Form, Input, Button } from 'antd'
import axios from 'axios'
const FormItem = Form.Item

class BuyDirect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountEth: 1,
      amountTokens: '...',
      priceGram: '...',
      priceEth: '...',
      fee: '...',
      success: '',
      failure: '',
      loading: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.calculateTokens = this.calculateTokens.bind(this)
    this.getSilverFinalPrice = this.getSilverFinalPrice.bind(this)
  }

  componentDidMount() {
    this.getFee()

    axios.all([
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'),
      axios.get('https://www.quandl.com/api/v3/datasets/LBMA/SILVER.json?api_key=y7Pa1CUGkHby28hYKivu')
    ])
      .then(axios.spread((eth, silver) => {
        this.setState({
          priceEth: eth.data.USD
        }, () => {
          this.getSilverFinalPrice(parseFloat(silver.data.dataset.data[0][1]) / 28.3495)
        })
      }))
      .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      })
  }

  getSilverFinalPrice(silverGramPrice) {
    this.props.Exchange.deployed().then((exchange) => {
      exchange.getEnergyPriceMarkup()
        .then((res) => {
          const silverMarkupPerGram = res.toNumber() / 1000
          const finalSilverGramPrice = ((silverMarkupPerGram + 100) * silverGramPrice) / 100

          this.setState({
            priceGram: finalSilverGramPrice.toFixed(2)
          }, () => {
            this.calculateTokens()
          })
        })
    })
  }

  getFee() {
    this.props.Exchange.deployed().then((exchange) => {
      exchange.fee()
        .then((res) => {
          this.setState({
            fee: `${res.toNumber() / 1000}% or at least 0.001 PWP`
          })
        })
    })
  }

  calculateTokens(calculateFee) {
    const etherInUsd = this.state.amountEth * this.state.priceEth
    const amountTokens = (etherInUsd / this.state.priceGram).toFixed(2)

    this.setState({ amountTokens })

    if (calculateFee) {
      this.props.Exchange.deployed().then((exchange) => {
        exchange.calculateFee.call(amountTokens * 1000)
          .then((res) => {
            this.setState({
              fee: `${res.toNumber() / 1000} PWP`
            })
          })
      })
    }
  }

  handleChange(event) {
    this.setState({ amountEth: event.target.value }, () => {
      this.calculateTokens(true)
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.setState({
      success: '',
      failure: '',
      loading: true
    })

    this.hide = message.loading('Action in progress..', 0)

    this.props.Exchange.deployed().then((exchange) => {
      exchange.buyDirect({
        from: this.props.account,
        value: this.props.web3.web3.toWei(this.state.amountEth, 'ether'),
        gas: 200000
      }).then((receipt) => {
        // eslint-disable-next-line
        console.log('receipt', receipt)

        this.hide();
        this.setState({ success: `Success! Transaction hash - ${receipt.tx}`, loading: false })
      }).catch((error) => {
        console.log(error)

        this.hide();
        this.setState({
          failure: 'Oops, something went wrong. Try again later.',
          loading: false
        })
      })
    })
  }

  render() {
    return (
      <div>
        <h4>Buy</h4>

        <p style={{ color: 'green' }}>{this.state.success ? this.state.success : null}</p>
        <p style={{ color: 'red' }}>{this.state.failure ? this.state.failure : null}</p>

        <h5>
            1 ETH = {this.state.priceEth} USD
        </h5>
        <h5>
            Price = {this.state.priceGram} USD
        </h5>
        <h5>
          {this.state.amountEth ? this.state.amountEth : 0}
            ETH = {this.state.amountTokens} PWP
        </h5>

        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <Input
              style={{ marginTop: 5 }}
              type="number"
              onChange={this.handleChange}
              value={this.state.amountEth}
              placeholder="Amount to buy"
            />
          </FormItem>

          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.loading}
          >
            Buy tokens
          </Button>
          <h6>* Fee: {this.state.fee} (for first time buyers)</h6>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    Exchange: state.Exchange,
    account: state.account,
    web3: state.web3
  }
}

export default connect(mapStateToProps)(BuyDirect)
*/