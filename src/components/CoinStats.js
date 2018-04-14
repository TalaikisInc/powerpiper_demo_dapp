import React, { Component } from 'react'
import { connect } from 'react-redux'
import env from '../env'
import Heading from 'grommet/components/Heading'
import List from 'grommet/components/List'
import ListItem  from 'grommet/components/ListItem'

class CoinStats extends Component {
  constructor(props) {
    super(props)

    this.state = {
      supply: null,
      network: null,
      crowdsaleAddress: null,
      capReached: null,
      hasClosed: null,
      weiRaised: null,
      cap: null
    }

    this.getCoinStats = this.getCoinStats.bind(this)
  }

  componentDidMount() {
    this.getCoinStats()
  }

  getCoinStats() {
    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.totalSupply().then((supply) => {
        this.setState({
          supply: supply.toNumber()
        })
      })
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      this.setState({
        crowdsaleAddress: crowdsale.address
      })
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.capReached.call().then((res) => {
        this.setState({
          capReached: res.toString()
        })
      })
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.hasClosed.call().then((res) => {
        this.setState({
          hasClosed: res.toString()
        })
      })
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.cap.call().then((res) => {
        this.setState({
          cap: res.toString()
        })
      })
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.weiRaised.call().then((res) => {
        this.setState({
          weiRaised: res.toNumber()
        })
      })
    })

    this.props.web3.web3.version.getNetwork((net) => {
      let network
      switch (net) {
        case '1':
          network = 'MainNet'
          break
        case '2':
          network = 'Morden (deprecated)'
          break
        case '3':
          network = 'Ropsten Test Network'
          break
        case '4':
          network = 'Rinkeby Test Network'
          break
        case '42':
          network = 'Kovan Test Network'
          break
        default:
          network = 'Local network'
      }

      this.setState({
        network: network
      })
    })

    setTimeout(() => {
      this.getCoinStats()
    }, 2000)
  }

  render() {
    return (
      <div>
        <Heading>Market Info</Heading>
        <List>
          <ListItem>Network: {this.state.network}</ListItem>
          <ListItem>Crowdsale Address: {this.state.crowdsaleAddress}</ListItem>
          <ListItem>Tokens in Circulation: { this.state.supply / 10 ** env.DECIMALS} {env.TOKEN_NAME}</ListItem>
          <ListItem>Cap reached: { this.state.capReached }</ListItem>
          <ListItem>Has ended: { this.state.hasClosed }</ListItem>
          <ListItem>Cap: { this.props.web3.web3.fromWei(this.state.cap, 'ether') } ETH</ListItem>
          <ListItem>ETH Raised: { this.props.web3.web3.fromWei(this.state.weiRaised, 'ether') } ETH</ListItem>
        </List>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale
  }
}

export default connect(mapStateToProps)(CoinStats)
