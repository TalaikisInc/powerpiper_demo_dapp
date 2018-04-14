import React, { Component } from 'react'
import { connect } from 'react-redux'
import env from '../env'
import Heading from 'grommet/components/Heading'
import List from 'grommet/components/List'
import ListItem  from 'grommet/components/ListItem'

class Balance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tokenBalance: null,
      balance: null
    }

    this.getBalance = this.getBalance.bind(this)
  }

  componentDidMount() {
    this.getBalance()
  }

  getBalance() {
    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.balanceOf(this.props.account).then((tokenBalance) => {
        this.setState({
          tokenBalance: tokenBalance ? tokenBalance.toNumber() : 'loading'
        })
      })
    })

    this.props.web3.web3.eth.getBalance(this.props.account, function(err, balance) {
      if (!err) {
        this.setState({
          balance: this.props.web3.web3.fromWei(balance.toNumber())
        })
      }
    }.bind(this))

    setTimeout(() => {
      this.getBalance()
    }, 2000)
  }

  render() {
    return (
      <div>
        { this.state.tokenBalance !== null ? <div>
          <Heading>Your Tokens</Heading>
          <List>
            <ListItem>
              { this.state.tokenBalance / 10 ** env.DECIMALS } { env.TOKEN_NAME }
            </ListItem>
          </List>
          </div>
          :
          '' }
        { this.state.balance !== null ? <div>
          <Heading>Your ETH</Heading>
          <List>
            <ListItem>
              { this.state.balance } ETH
            </ListItem>
          </List>
          </div>
          :
          ''
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    account: state.account
  }
}

export default connect(mapStateToProps)(Balance)
