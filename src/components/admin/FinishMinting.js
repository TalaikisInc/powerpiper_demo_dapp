import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import CheckBox  from 'grommet/components/CheckBox'

class FinishMint extends Component {
  constructor() {
    super()
    this.state = {
      status: '',
      ok: null,
      modalOpen: null,
      success: '',
      failure: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.getMintStatus = this.getMintStatus.bind(this)
  }

  componentDidMount() {
    this.getMintStatus()
  }

  getMintStatus() {
    this.props.Token.deployed().then(async (token) => {
      token.mintingFinished().then((res) => {
        this.setState({
          status: res.toString()
        })
      })
    })

    setTimeout(() => {
      this.getMintStatus()
    }, 2000)
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if(this.state.ok) {
        token.finishMinting({ from: this.props.account })
          .then((receipt) => {
            // console.log('Success: ', receipt)
            this.setState({
                modalOpen: true,
                success: `Success! Your tx: ${receipt.tx}`
            })
          })
          .catch((error) => {
            // console.log(error.message)
            this.setState({
                modalOpen: true,
                failure: `Error occurred: ${error.message}`
            })
          })
      } else {
        this.setState({
            modalOpen: true,
            failure: `You need to agree it can't be undone!`
        })
      }
    })
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Finsih Minting</Heading>
        <Label>Minting finished: { this.state.status }</Label>
        <Form onSubmit={this.handleSubmit}>
          <Box pad='small' align='center'>
            <CheckBox id='checked' name='ok' label='I confirm' onChange={e => this.setState({ ok: e.target.checked })} toggle={true} />
          </Box>
          <Box pad='small' align='center'>
            <Button primary={true} type='submit' label='Finish' />
          </Box>
        </Form>
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
    web3: state.web3,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(FinishMint)
