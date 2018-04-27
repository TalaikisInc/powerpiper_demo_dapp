import React, { Component } from 'react'
import { connect } from 'react-redux'

import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import CheckBox  from 'grommet/components/CheckBox'

class DeleteUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      success: '',
      failure: '',
      loading: false,
      registered: true,
      loaded: false,
      status: '',
      ok: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.getUserExists = this.getUserExists.bind(this)
  }

  componentDidMount() {
    this.getUserExists()
  }

  getUserExists() {
    this.props.Token.deployed().then(async (token) => {
      token.existsUser(this.props.account, { from: this.props.account })
        .then((res) => {
          if (res) {
            this.setState({
              registered: true
            })
          } else {
            this.setState({
              registered: false,
              status: `This account isn't registered, so we don't have what to do.`
            })
          }
        })
        .catch((error) => {
          // if Something goes wrong, disable the form
          this.setState({
            registered: false,
            status: 'Some error occurred, so disabled the form.'
          })
        })
      })

    setTimeout(() => {
      this.getUserExists()
    }, 2000)
  }

  handleSubmit(event) {
    event.preventDefault()

    if(this.state.ok && this.state.registered) {
      this.props.Token.deployed().then(async (token) => {
        this.setState({
          loading: true
        })

        token.deleteUser(this.props.account, { from: this.props.account }).then((res) => {
          if(res) {
            this.setState({
              success: `Your profile was deleted! Tx: ${res.tx}`
            })
          } else {
            this.setState({
              registered: false,
              Failure: 'Some error occurred, so disabled the form.',
              loading: false
            })
          }
        })
        .catch((error) => {
          // if Something goes wrong, disable the form
          this.setState({
            registered: false,
            Failure: 'Some error occurred, so disabled the form.',
            loading: false
          })
        })

      })
    }
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Delete Account</Heading>
        { this.state.registered ?
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="checked">Are you sure?</Label>
            </Box>
            <Box pad='small' align='center'>
            <CheckBox id='checked' name='ok' label="Yes, I'm sure" onChange={e => this.setState({ ok: e.target.checked })} toggle={true} />
            </Box>
            <Box pad='small' align='center'>
              { this.state.loading ? 'Working...' :
                <Button primary={true} type='submit' label='Delete' />
              }
            </Box>
          </Form>
        </Box>
        :
        <Label align="center">{this.state.status}</Label>
        }
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
    Token: state.Token,
    account: state.account,
    web3: state.web3,
    ipfs: state.ipfs
  }
}

export default connect(mapStateToProps)(DeleteUser)
