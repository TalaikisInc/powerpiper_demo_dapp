import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import web3utils from 'web3-utils'

class ReclaimTokens extends Component {
  constructor(props) {
    super(props)

    this.state = {
      from: '',
      success: '',
      failure: '',
      modalOpen: false
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

    this.props.Crowdsale.deployed().then(async (crowdsale) => {
      if (web3utils.isAddress(this.state.from)) {
        crowdsale.reclaimToken(this.state.from, { from: this.props.account })
          .then((receipt) => {
            // console.log(receipt)
            this.setState({
              modalOpen: true,
              success: `Success! Your tx: ${receipt.tx}`
            })
        })
        .catch((err) => {
          // console.log(err)
          this.setState({
            modalOpen: true,
            failure: `Error occurred: ${err.message}`
          })
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: `If you want to reclaim tokens from user, you need to fill the form.`
        })
      }
    })
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Reclaim Tokens</Heading>
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="fromInput">From whom:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='fromInput'
                type='text'
                name='from'
                onDOMChange={this.handleChange}
                value={this.state.from}
                placeHolder='Address' />
            </Box>
            <Box pad='small' align='center'>
              <Button primary={true} type='submit' label='Reclaim' />
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
    Crowdsale: state.Crowdsale,
    account: state.account,
    web3: state.web3
  }
}

export default connect(mapStateToProps)(ReclaimTokens)
