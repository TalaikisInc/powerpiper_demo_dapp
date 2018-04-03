import React, { Component } from 'react'
import { connect } from 'react-redux'

/*
@TODO export token name to external env
*/
class Balance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: '...'
    }

    this.getBalance = this.getBalance.bind(this)
  }

  componentDidMount() {
    this.getBalance()
  }

  getBalance() {
    this.props.Token.deployed().then((token) => {
      token.balanceOf(this.props.account).then((balance) => {
        this.setState({
          balance: balance.toNumber() / 1000
        })
      })
    })

    setTimeout(() => {
      this.getBalance()
    }, 2000)
  }

  render() {
    return (
      <div>
        <h4>Your Balance</h4>
        <h5><span>{this.state.balance} PWP</span></h5>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(Balance)
