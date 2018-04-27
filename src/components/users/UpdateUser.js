import React, { Component } from 'react'
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

import { encrypt, decrypt } from '../../utils/crypto'
import data from '../../utils/data'

class UpdateUser extends Component {
  constructor(props) {
    super(props)

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
      loaded: false,
      status: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUploadFile = this.handleUploadFile.bind(this)
    this.getUser = this.getUser.bind(this)
    this.getUserExists = this.getUserExists.bind(this)
  }

  componentDidMount() {
    this.getUserExists()
    this.getUser()
  }

  handleChange(event) {
    const value = event.target.value ? event.target.value : event.option.value
    
    this.setState({
      [event.target.name]: value
    })
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

  getUser() {
    if (this.state.registered && !this.state.loaded) {
      this.props.Token.deployed().then(async (token) => {
        token.getUser(this.props.account, { from: this.props.account }).then(async (res) => {
          const _decryptedHash = await decrypt(res[1], process.env.REACT_APP_HASH_PASS)
          this.props.ipfs.catJSON(_decryptedHash, async (err, data) => {
            if(err) {
              // console.log(err)
              this.setState({
                modalOpen: true,
                failure: `Error occurred: ${err.message}`
              })
            } else {
              const _obj = JSON.parse(await decrypt(await decrypt(data, this.props.account), process.env.REACT_APP_ENCRYPTION_PASS))
               this.setState({
                user: res[1],
                email: _obj.email,
                firstName: _obj.firstName,
                lastName: _obj.lastName,
                address: _obj.address,
                city: _obj.city,
                country: _obj.country,
                phone: _obj.phone,
                docType: _obj.docType,
                docNo: _obj.docNo,
                addressDocument: _obj.addressDocument,
                idDocument: _obj.idDocument,
                loaded: true
              })
            }
          })
        })
        .catch((error) => {
          // console.log(error.message)
          this.setState({
            modalOpen: true,
            failure: `Error occurred: ${error.message}`
          })
        })
      })
    }

    setTimeout(() => {
      this.getUser()
    }, 2000)
  }

  handleSubmit(event) {
    event.preventDefault()

    this.setState({
      loading: true
    })

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
          if (err) {
            this.setState({
              failure: `Error occurred: ${err.message}`,
              loading: false
            })
          } else {
            const _encryptedHash = await encrypt(_hash, process.env.REACT_APP_HASH_PASS)
            token.updateUser(this.props.account, _encryptedHash, {
              from: this.props.account,
              gas: 300000
            })
              .then((receipt) => {
                this.setState({
                  modalOpen: true,
                  success: `Success! Your tx: ${receipt.tx}`,
                  registered: true,
                  loading: false
                })
              })
              .catch((err) => {
                if (err.message.indexOf('User denied') != -1) {
                  this.setState({
                    modalOpen: true,
                    failure: 'You rejected tx.',
                    loading: false
                  })
                } else {
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
        if (!this.state.registered) {
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
          this.setState({
            [name]: e.target.result
          })
        }.bind(this)
    }.bind(this))(data)
    reader.readAsDataURL(data)
    } else {
      this.setState({
        modalOpen: true,
        failure: `We can accept only image files.`
      })
    }
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Update Account</Heading>
        { this.state.registered ?
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
                <Button primary={true} type='submit' label='Update' />
              }
            </Box>
          </Form>
          <p><strong>*</strong> Required fields</p>
          <p><strong>NOTE</strong>. Don't use real data in demo app!</p>
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

export default connect(mapStateToProps)(UpdateUser)
