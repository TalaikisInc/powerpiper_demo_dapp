import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import env from '../env'
import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import List from 'grommet/components/List'
import ListItem  from 'grommet/components/ListItem'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'

/*
LIST OF EXCHANGE RELATED APRTS:
* transfer/ send (buy)
* list of available places/ equips/ users
*/
class Exchange extends Component {
  constructor(props) {
    super(props)

    this.state = {
      to: '',
      success: '',
      failure: ''
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
      failure: ''
    })

    this.props.Crowdsale.deployed().then((crowdsale) => {
      if (this.state.amountEth > env.MINIMUM_CONTRIBUTION) {
        this.props.web3.web3.eth.sendTransaction({
          from: this.props.account,
          to: crowdsale.address,
          value:  this.props.web3.web3.toWei(this.state.amountEth, 'ether'),
          gas: 300000,
          data: '0x00'
        }, (err, receipt) => {
          if (!err) {
            this.setState({
              modalOpen: true,
              success: `Success! Your tx: ${receipt}`
            })
          } else {
            this.setState({
              modalOpen: true,
              failure: `Error occured: ${err.message}`
            })
          }
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: `Minimum contribution is ${env.MINIMUM_CONTRIBUTION} ETH`
        })
      }
    })

  }

  render() {
    return (
      <Box>
        <Heading>Buy {env.TOKEN_NAME} Tokens</Heading>
        <List>
          <ListItem>1 ETH = { this.state.priceEth } USD</ListItem>
          <ListItem>1 PWP = { (1 / env.RATE).toFixed(6) } ETH</ListItem>
          <ListItem>1 PWP = $US { (this.state.priceEth / env.RATE).toFixed(2) }</ListItem>
        </List>
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="amountInput">Your Contribution:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='amountInput'
                type='number'
                step='0.01'
                onDOMChange={this.handleChange}
                value={this.state.amountEth}
                placeHolder='Amount to buy' />
              <Label>
                { this.state.amountEth > 0 ? `${this.state.amountEth} ETH = ` : '' }
                { this.state.amountTokens > 0 ? `${this.state.amountTokens} PWP` : '' }
              </Label>
            </Box>
            <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Buy tokens' />
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
    // Token: state.Token,
    Crowdsale: state.Crowdsale,
    account: state.account,
    web3: state.web3
  }
}

export default connect(mapStateToProps)(Exchange)
