import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Form, Input, Button } from 'antd'
const FormItem = Form.Item

class Approve extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountEth: null,
      success: '',
      sender: null,
      failure: '',
      loading: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
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

    this.hide = message.loading('In progress..', 0)

    this.setState({
      success: '',
      failure: '',
      loading: true
    })

    this.props.Token.deployed().then((token) => {
        token.approve(this.state.sender, this.props.web3.web3.toWei(this.state.amountEth, 'ether'), {
        from: this.props.account,
        gas: 300000
      })
        .then((receipt) => {
          console.log('receipt', receipt)
          this.hide()
          this.hide = message.loading(`Done, tx: ${receipt.tx}`, 0)
        }).catch((error) => {
          console.log(error)
          this.hide()
          this.hide = message.loading(`Encountered error: ${error}`, 0)
        })
    })

  }

  render() {
    return (
      <div>
        <h4>Aproove token buy</h4>

        <p>{ this.state.success ? this.state.success : null }</p>
        <p>{ this.state.failure ? this.state.failure : null }</p>

        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <Input type='text' name='sender' onChange={this.handleChange} value={this.state.sender} placeholder='Who to approve' />  
            <Input type='number' name='amountEth' onChange={this.handleChange} value={this.state.amountEth} placeholder='Amount to approve' />
          </FormItem>
          <Button type='primary' htmlType='submit' loading={this.state.loading}>
            Approve
          </Button>
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

export default connect(mapStateToProps)(Approve)
