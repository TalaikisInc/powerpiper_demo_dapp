import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Form, Input, Button } from 'antd'
import axios from 'axios'
const FormItem = Form.Item

class BuyIcoTokens extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountEth: 1,
      amountTokens: '...',
      priceKWh: '...',
      priceEth: '...',
      fee: '...',
      success: '',
      failure: '',
      loading: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.calculateTokens = this.calculateTokens.bind(this)
    this.getFinalPrice = this.getFinalPrice.bind(this)
  }

  componentDidMount() {
    this.getFee()

    /*
    @TODO get actual energy prices
    */
    const staticKWhPrice = 0.1
    axios.all([
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
    ])
      .then(axios.spread((eth) => {
        this.setState({
          priceEth: eth.data.USD
        }, () => {
          this.getFinalPrice(parseFloat(staticKWhPrice))
        })
      }))
      .catch((error) => {
        console.log(error)
      })
  }

  getFinalPrice(energyPrice) {
    this.props.Token.deployed().then((token) => {
      token.getEnergyPriceMarkup()
        .then((res) => {
          const markupPerKWh = res.toNumber() / 1000
          const finalPrice = ((markupPerKWh + 100) * energyPrice) / 100

          this.setState({
            priceKWh: finalPrice.toFixed(2)
          }, () => {
            this.calculateTokens()
          })
        })
    })
  }

  getFee() {
    this.props.Token.deployed().then((token) => {
      token.getFee()
        .then((res) => {
          this.setState({
            fee: `${res.toNumber() / 1000}% or at least 0.001 PWP`
          })
        })
    })
  }

  calculateTokens(calculateFee) {
    const etherInUsd = this.state.amountEth * this.state.priceEth
    const amountTokens = (etherInUsd / this.state.priceKWh).toFixed(2)

    this.setState({ amountTokens })

    if (calculateFee) {
      this.props.Token.deployed().then((token) => {
        token.calculateFee.call(amountTokens * 1000)
          .then((res) => {
            this.setState({
              fee: `${res.toNumber() / 1000} PWP`
            })
          })
      })
    }
  }

  handleChange(event) {
    this.setState({
      amountEth: event.target.value
    }, () => {
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

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.buyTokens(this.props.account, {
        from: this.props.account,
        value: this.props.web3.web3.toWei(this.state.amountEth, 'ether')
      }).then((receipt) => {
        console.log('receipt', receipt)
        this.hide()
        this.setState({
          success: `Success! Transaction hash - ${receipt.tx}`,
          loading: false
        })
      }).catch((error) => {
        console.log(error)
        this.hide()
        this.setState({
          failure: `Oops, something went wrong: ${error}`,
          loading: false
        })
      })
    })
  }

  render() {
    return (
      <div>
        <h4>Buy tokens</h4>

        <p>{this.state.success ? this.state.success : null}</p>
        <p>{this.state.failure ? this.state.failure : null}</p>

        <h5>
          1 ETH = {this.state.priceEth} USD
        </h5>
        <h5>
          1 kWh Price = {this.state.priceKWh} USD
        </h5>
        <h5>
          { this.state.amountEth ? this.state.amountEth : 0} ETH = {this.state.amountTokens} PWP
        </h5>

        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <Input
              type='number'
              onChange={this.handleChange}
              value={this.state.amountEth}
              placeholder='Amount to buy'
            />
          </FormItem>

          <Button
            type='primary'
            htmlType='submit'
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
    Token: state.Token,
    Crowdsale: state.Crowdsale,
    account: state.account,
    web3: state.web3
  }
}

export default connect(mapStateToProps)(BuyIcoTokens)
