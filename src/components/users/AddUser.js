import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import validator from 'validator'

import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import Select  from 'grommet/components/Select'

import { encrypt } from '../../utils/crypto'
import data from '../../utils/data'

class AddUser extends PureComponent {
  constructor(props) {
    super(props)

    this.mounted = false

    this.state = {
      success: '',
      failure: '',
      email: '',
      firstName: '',
      lastName: '',
      modalOpen: false,
      country: '',
      address: '',
      city: '',
      phone: '',
      docType: '',
      docNo: '',
      idDocument: '',
      addressDocument: '',
      loading: false,
      registered: true,
      status: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUploadFile = this.handleUploadFile.bind(this)
    this.getUser = this.getUser.bind(this)
  }

  componentWillMount() {
		this.mounted = true
  }
  
  componentWillUnmount() {
		this.mounted = false
  }

  componentDidMount() {
    this.getUser()
  }

  handleChange(event) {
    const value = event.target.value ? event.target.value : event.option.value
    
    if (this.mounted) {
      this.setState({
        [event.target.name]: value
      })
    }
  }

  getUser() {
    this.props.Token.deployed().then(async (token) => {
      token.existsUser(this.props.account, { from: this.props.account })
        .then((res) => {
          if (res && this.mounted) {
            this.setState({
              registered: true,
              status: 'This account is already registered.'
            })
          } else if (this.mounted) {
            this.setState({
              registered: false
            })
          }
        })
        .catch((error) => {
          // console.log('Add user', error)
          if(this.mounted) {
            this.setState({
              registered: true
            })
          }
        })
      })

    setTimeout(() => {
      this.getUser()
    }, 2000)
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.mounted) {
      this.setState({
        loading: true
      })
    }

    this.props.Token.deployed().then(async (token) => {
      if (validator.isEmail(this.state.email) && this.state.firstName != null && this.state.lastName != null) {

        const _data = await encrypt(await encrypt(JSON.stringify({
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address,
          city: this.state.city,
          country: this.state.country,
          phone: this.state.phone,
          docType: this.state.docType,
          docNo: this.state.docNo,
          addressDocument: this.state.addressDocument,
          idDocument: this.state.idDocument
        }), process.env.REACT_APP_ENCRYPTION_PASS), this.props.account)

        this.props.ipfs.addJSON(_data, async (err, _hash) => {
          if (err && this.mounted) {
            this.setState({
              failure: `Error occurred: ${err.message}`,
              loading: false
            })
          } else if (this.mounted) {
            const _encryptedHash = await encrypt(_hash, process.env.REACT_APP_HASH_PASS)
            const _gas = await token.newUser.estimateGas(_encryptedHash)
            token.newUser(_encryptedHash, {
              from: this.props.account,
              gas: _gas,
              gasPrice: this.props.gasPrice
            })
              .then((receipt) => {
                if (this.mounted) {
                  this.setState({
                    modalOpen: true,
                    success: `Success! Your tx: ${receipt.tx}`,
                    registered: true,
                    loading: false
                  })
                }
              })
              .catch((err) => {
                if (err.message.indexOf('User denied') !== -1 && this.mounted) {
                  this.setState({
                    modalOpen: true,
                    failure: 'Tx rejected',
                    loading: false
                  })
                } else if (this.mounted) {
                  this.setState({
                    modalOpen: true,
                    failure: `Error occurred: ${err.message}`,
                    loading: false
                  })
                }
              })
          }
        })
      } else {
        if (!this.state.registered && this.mounted) {
          this.setState({
            modalOpen: true,
            failure: `Please check the form.`,
            loading: false
          })
        }
      }
    })
  }

  handleUploadFile(event) {
    const data = event.target.files[0]
    const name = event.target.name
    if (data.type.match('image/*')) {
      const reader = new FileReader()
      reader.onload = (function(theFile) {
        return function(e) {
          if (this.mounted) {
            this.setState({
              [name]: e.target.result
            })
          }
        }.bind(this)
    }.bind(this))(data)
    reader.readAsDataURL(data)
    } else if (this.mounted) {
      this.setState({
        modalOpen: true,
        failure: `We can accept only image files.`
      })
    }
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Register</Heading>
        { this.state.registered ? <Label align="center">{this.state.status}</Label>
        :
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="email">Email<sup>*</sup>:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='email'
                type='text'
                name='email'
                onDOMChange={this.handleChange}
                value={this.state.email}
                placeHolder='Email' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="firstName">First name<sup>*</sup>:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='firstName'
                type='text'
                name='firstName'
                onDOMChange={this.handleChange}
                value={this.state.firstName}
                placeHolder='First name' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="lastName">Last name<sup>*</sup>:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='lastName'
                type='text'
                name='lastName'
                onDOMChange={this.handleChange}
                value={this.state.lastName}
                placeHolder='Last name' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="address">Your address:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='address'
                type='text'
                name='address'
                onDOMChange={this.handleChange}
                value={this.state.address}
                placeHolder='Your Address' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="city">City:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='city'
                type='text'
                name='city'
                onDOMChange={this.handleChange}
                value={this.state.city}
                placeHolder='Your City' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="country">Country:</Label>
            </Box>
            <Box pad='small' align='center'>
              <Select
                name='country'
                onChange={this.handleChange}
                value={this.state.country}
                options={data.countries}
                placeHolder='Your country' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="phone">Phone:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='phone'
                type='text'
                name='phone'
                onDOMChange={this.handleChange}
                value={this.state.phone}
                placeHolder='Your Phone' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="docType">Document Type:</Label>
            </Box>
            <Box pad='small' align='center'>
              <Select
                name='docType'
                onChange={this.handleChange}
                value={this.state.docType}
                options={data.docTypes}
                placeHolder='Document Type' />
            </Box>
            <Box pad='small' align='center'>
              <Label labelFor="docNo">Document Number:</Label>
            </Box>
            <Box pad='small' align='center'>
              <TextInput id='docNo'
                type='text'
                name='docNo'
                onDOMChange={this.handleChange}
                value={this.state.docNo}
                placeHolder='Your Doc. Number' />
            </Box>
            <Box pad='small' align='center'>
              <Label>Please attach your ID:</Label>
              <input id='f-file' name='idDocument' type='file' onChange={this.handleUploadFile} />
            </Box>
            <Box pad='small' align='center'>
              <Label>Please attach your address confirmation:</Label>
              <input id='f-file' name='addressDocument' type='file' onChange={this.handleUploadFile} />
            </Box>
            <Box pad='small' align='center'>
              { this.state.loading ? 'Working...' :
                <Button primary={true} type='submit' label='Register' />
              }
            </Box>
          </Form>
          <p><strong>*</strong> Required fields</p>
          <p><strong>NOTE</strong>. Don't use real data in demo app!</p>
        </Box>
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
    ipfs: state.ipfs,
    gasPrice: state.gasPrice
  }
}

export default connect(mapStateToProps)(AddUser)
