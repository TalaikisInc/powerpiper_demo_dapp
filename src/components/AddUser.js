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

import { encrypt } from '../utils/crypto'

class AddUser extends Component {
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
      addressDocument: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUploadFile = this.handleUploadFile.bind(this)
  }

  handleChange(event) {
    const value = event.target.value ? event.target.value : event.option.value
    
    this.setState({
      [event.target.name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if (validator.isEmail(this.state.email) && this.state.firstName != null && this.state.lastName != null) {

        const _data = await encrypt(JSON.stringify({
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
        }), process.env.REACT_APP_ENCRYPTION_PASS)

        this.props.ipfs.addJSON(_data, async (err, _hash) => {
          if (err) {
            this.setState({
              failure: `Error occured: ${err.message}`
            })
          } else {
            const _encryptedHash = await encrypt(_hash, process.env.REACT_APP_HASH_PASS)
            token.newUser(_encryptedHash, {
              from: this.props.account,
              gas: 300000
            })
              .then((receipt) => {
                this.setState({
                  modalOpen: true,
                  success: `Success! Your tx: ${receipt.tx}`
                })
              })
              .catch((err) => {
                this.setState({
                  modalOpen: true,
                  failure: `Error occured: ${err.message}`
                })
              })
          }
        })
      } else {
        this.setState({
          modalOpen: true,
          failure: `Please check the form.`
        })
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
    const docTypes = [
      { label: 'Passport', value: 'Passport' },
      { label: 'Personal ID', value: 'Personal ID' },
      { label: `Driver's licence`, value: `Driver's licence` }
    ]

    const countries = [
      { value: 'Afghanistan', label: 'Afghanistan' },
      { value: 'Albania', label: 'Albania' },
      { value: 'Algeria', label: 'Algeria' },
      { value: 'Andorra', label: 'Andorra' },
      { value: 'Angola', label: 'Angola' },
      { value: 'Anguilla', label: 'Anguilla' },
      { value: 'Antigua & Barbuda', label: 'Antigua & Barbuda' },
      { value: 'Argentina', label: 'Argentina' },
      { value: 'Armenia', label: 'Armenia' },
      { value: 'Australia', label: 'Australia' },
      { value: 'Austria', label: 'Austria' },
      { value: 'Azerbaijan', label: 'Azerbaijan' },
      { value: 'Bahamas', label: 'Bahamas' },
      { value: 'Bahrain', label: 'Bahrain' },
      { value: 'Bangladesh', label: 'Bangladesh' },
      { value: 'Barbados', label: 'Barbados' },
      { value: 'Belarus', label: 'Belarus' },
      { value: 'Belgium', label: 'Belgium' },
      { value: 'Belize', label: 'Belize' },
      { value: 'Benin', label: 'Benin' },
      { value: 'Bermuda', label: 'Bermuda' },
      { value: 'Bhutan', label: 'Bhutan' },
      { value: 'Bolivia', label: 'Bolivia' },
      { value: 'Bosnia & Herzegovina', label: 'Bosnia & Herzegovina' },
      { value: 'Botswana', label: 'Botswana' },
      { value: 'Brazil', label: 'Brazil' },
      { value: 'Brunei Darussalam', label: 'Brunei Darussalam' },
      { value: 'Bulgaria', label: 'Bulgaria' },
      { value: 'Burkina Faso', label: 'Burkina Faso' },
      { value: 'Myanmar/Burma', label: 'Myanmar/Burma' },
      { value: 'Burundi', label: 'Burundi' },
      { value: 'Cambodia', label: 'Cambodia' },
      { value: 'Cameroon', label: 'Cameroon' },
      { value: 'Canada', label: 'Canada' },
      { value: 'Cape Verde', label: 'Cape Verde' },
      { value: 'Cayman Islands', label: 'Cayman Islands' },
      { value: 'Central African Republic', label: 'Central African Republic' },
      { value: 'Chad', label: 'Chad' },
      { value: 'Chile', label: 'Chile' },
      { value: 'China', label: 'China' },
      { value: 'Colombia', label: 'Colombia' },
      { value: 'Comoros', label: 'Comoros' },
      { value: 'Congo', label: 'Congo' },
      { value: 'Costa Rica', label: 'Costa Rica' },
      { value: 'Croatia', label: 'Croatia' },
      { value: 'Cuba', label: 'Cuba' },
      { value: 'Cyprus', label: 'Cyprus' },
      { value: 'Czech Republic', label: 'Czech Republic' },
      { value: 'Democratic Republic of the Congo', label: 'Democratic Republic of the Congo' },
      { value: 'Denmark', label: 'Denmark' },
      { value: 'Djibouti', label: 'Djibouti' },
      { value: 'Dominica', label: 'Dominica' },
      { value: 'Dominican Republic', label: 'Dominican Republic' },
      { value: 'Ecuador', label: 'Ecuador' },
      { value: 'Egypt', label: 'Egypt' },
      { value: 'El Salvador', label: 'El Salvador' },
      { value: 'Equatorial Guinea', label: 'Equatorial Guinea' },
      { value: 'Eritrea', label: 'Eritrea' },
      { value: 'Estonia', label: 'Estonia' },
      { value: 'Ethiopia', label: 'Ethiopia' },
      { value: 'Fiji', label: 'Fiji' },
      { value: 'Finland', label: 'Finland' },
      { value: 'France', label: 'France' },
      { value: 'French Guiana', label: 'French Guiana' },
      { value: 'Gabon', label: 'Gabon' },
      { value: 'Gambia', label: 'Gambia' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Germany', label: 'Germany' },
      { value: 'Ghana', label: 'Ghana' },
      { value: 'Great Britain', label: 'Great Britain' },
      { value: 'Greece', label: 'Greece' },
      { value: 'Grenada', label: 'Grenada' },
      { value: 'Guadeloupe', label: 'Guadeloupe' },
      { value: 'Guatemala', label: 'Guatemala' },
      { value: 'Guinea', label: 'Guinea' },
      { value: 'Guinea-Bissau', label: 'Guinea-Bissau' },
      { value: 'Guyana', label: 'Guyana' },
      { value: 'Haiti', label: 'Haiti' },
      { value: 'Honduras', label: 'Honduras' },
      { value: 'Hungary', label: 'Hungary' },
      { value: 'Iceland', label: 'Iceland' },
      { value: 'India', label: 'India' },
      { value: 'Indonesia', label: 'Indonesia' },
      { value: 'Iran', label: 'Iran' },
      { value: 'Iraq', label: 'Iraq' },
      { value: 'Israel and the Occupied Territories', label: 'Israel and the Occupied Territories' },
      { value: 'Italy', label: 'Italy' },
      { value: `Ivory Coast (Cote d'Ivoire)`, label: `Ivory Coast (Cote d'Ivoire)` },
      { value: 'Jamaica', label: 'Jamaica' },
      { value: 'Japan', label: 'Japan' },
      { value: 'Jordan', label: 'Jordan' },
      { value: 'Kazakhstan', label: 'Kazakhstan' },
      { value: 'Kenya', label: 'Kenya' },
      { value: 'Kosovo', label: 'Kosovo' },
      { value: 'Kuwait', label: 'Kuwait' },
      { value: 'Kyrgyz Republic (Kyrgyzstan)', label: 'Kyrgyz Republic (Kyrgyzstan)' },
      { value: 'Laos', label: 'Laos' },
      { value: 'Latvia', label: 'Latvia' },
      { value: 'Lebanon', label: 'Lebanon' },
      { value: 'Lesotho', label: 'Lesotho' },
      { value: 'Liberia', label: 'Liberia' },
      { value: 'Libya', label: 'Libya' },
      { value: 'Liechtenstein', label: 'Liechtenstein' },
      { value: 'Lithuania', label: 'Lithuania' },
      { value: 'Luxembourg', label: 'Luxembourg' },
      { value: 'Republic of Macedonia', label: 'Republic of Macedonia' },
      { value: 'Madagascar', label: 'Madagascar' },
      { value: 'Malawi', label: 'Malawi' },
      { value: 'Malaysia', label: 'Malaysia' },
      { value: 'Maldives', label: 'Maldives' },
      { value: 'Mali', label: 'Mali' },
      { value: 'Malta', label: 'Malta' },
      { value: 'Martinique', label: 'Martinique' },
      { value: 'Mauritania', label: 'Mauritania' },
      { value: 'Mauritius', label: 'Mauritius' },
      { value: 'Mayotte', label: 'Mayotte' },
      { value: 'Mexico', label: 'Mexico' },
      { value: `Moldova', Republic of`, label: `Moldova', Republic of` },
      { value: 'Monaco', label: 'Monaco' },
      { value: 'Mongolia', label: 'Mongolia' },
      { value: 'Montenegro', label: 'Montenegro' },
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Morocco', label: 'Morocco' },
      { value: 'Mozambique', label: 'Mozambique' },
      { value: 'Namibia', label: 'Namibia' },
      { value: 'Nepal', label: 'Nepal' },
      { value: 'Netherlands', label: 'Netherlands' },
      { value: 'New Zealand', label: 'New Zealand' },
      { value: 'Nicaragua', label: 'Nicaragua' },
      { value: 'Niger', label: 'Niger' },
      { value: 'Nigeria', label: 'Nigeria' },
      { value: `Korea, Democratic Republic of (North Korea)`, label: `Korea, Democratic Republic of (North Korea)` },
      { value: 'Norway', label: 'Norway' },
      { value: 'Oman', label: 'Oman' },
      { value: 'Pacific Islands', label: 'Pacific Islands' },
      { value: 'Pakistan', label: 'Pakistan' },
      { value: 'Panama', label: 'Panama' },
      { value: 'Papua New Guinea', label: 'Papua New Guinea' },
      { value: 'Paraguay', label: 'Paraguay' },
      { value: 'Peru', label: 'Peru' },
      { value: 'Philippines', label: 'Philippines' },
      { value: 'Poland', label: 'Poland' },
      { value: 'Portugal', label: 'Portugal' },
      { value: 'Puerto Rico', label: 'Puerto Rico' },
      { value: 'Qatar', label: 'Qatar' },
      { value: 'Reunion', label: 'Reunion' },
      { value: 'Romania', label: 'Romania' },
      { value: 'Russian Federation', label: 'Russian Federation' },
      { value: 'Rwanda', label: 'Rwanda' },
      { value: 'Saint Kitts and Nevis', label: 'Saint Kitts and Nevis' },
      { value: 'Saint Lucia', label: 'Saint Lucia' },
      { value: `Saint Vincent's & Grenadines`, label: `Saint Vincent's & Grenadines` },
      { value: 'Samoa', label: 'Samoa' },
      { value: 'Sao Tome and Principe', label: 'Sao Tome and Principe' },
      { value: 'Saudi Arabia', label: 'Saudi Arabia' },
      { value: 'Senegal', label: 'Senegal' },
      { value: 'Serbia', label: 'Serbia' },
      { value: 'Seychelles', label: 'Seychelles' },
      { value: 'Sierra Leone', label: 'Sierra Leone' },
      { value: 'Singapore', label: 'Singapore' },
      { value: 'Slovak Republic (Slovakia)', label: 'Slovak Republic (Slovakia)' },
      { value: 'Slovenia', label: 'Slovenia' },
      { value: 'Solomon Islands', label: 'Solomon Islands' },
      { value: 'Somalia', label: 'Somalia' },
      { value: 'South Africa', label: 'South Africa' },
      { value: `Korea, Republic of (South Korea)`, label: `Korea, Republic of (South Korea)` },
      { value: 'South Sudan', label: 'South Sudan' },
      { value: 'Spain', label: 'Spain' },
      { value: 'Sri Lanka', label: 'Sri Lanka' },
      { value: 'Sudan', label: 'Sudan' },
      { value: 'Suriname', label: 'Suriname' },
      { value: 'Swaziland', label: 'Swaziland' },
      { value: 'Sweden', label: 'Sweden' },
      { value: 'Switzerland', label: 'Switzerland' },
      { value: 'Syria', label: 'Syria' },
      { value: 'Tajikistan', label: 'Tajikistan' },
      { value: 'Tanzania', label: 'Tanzania' },
      { value: 'Thailand', label: 'Thailand' },
      { value: 'Timor Leste', label: 'Timor Leste' },
      { value: 'Togo', label: 'Togo' },
      { value: 'Trinidad & Tobago', label: 'Trinidad & Tobago' },
      { value: 'Tunisia', label: 'Tunisia' },
      { value: 'Turkey', label: 'Turkey' },
      { value: 'Turkmenistan', label: 'Turkmenistan' },
      { value: 'Turks & Caicos Islands', label: 'Turks & Caicos Islands' },
      { value: 'Uganda', label: 'Uganda' },
      { value: 'Ukraine', label: 'Ukraine' },
      { value: 'United Arab Emirates', label: 'United Arab Emirates' },
      { value: 'United States of America (USA)', label: 'United States of America (USA)' },
      { value: 'Uruguay', label: 'Uruguay' },
      { value: 'Uzbekistan', label: 'Uzbekistan' },
      { value: 'Venezuela', label: 'Venezuela' },
      { value: 'Vietnam', label: 'Vietnam' },
      { value: 'Virgin Islands (UK)', label: 'Virgin Islands (UK)' },
      { value: 'Virgin Islands (US)', label: 'Virgin Islands (US)' },
      { value: 'Yemen', label: 'Yemen' },
      { value: 'Zambia', label: 'Zambia' },
      { value: 'Zimbabwe', label: 'Zimbabwe' }
    ]

    return (
      <Box align='center'>
        <Heading>Register</Heading>
        <Box align='center'>
          <Form onSubmit={this.handleSubmit}>
            <Box pad='small' align='center'>
              <Label labelFor="email">Email:</Label>
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
              <Label labelFor="firstName">First name:</Label>
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
              <Label labelFor="lastName">Last name:</Label>
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
                options={countries}
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
                options={docTypes}
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
              <Button primary={true} type='submit' label='Register' />
            </Box>
          </Form>
          <p><strong>NOTE</strong>. Don't use real data in demo app!</p>
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
    Token: state.Token,
    account: state.account,
    web3: state.web3,
    ipfs: state.ipfs
  }
}

export default connect(mapStateToProps)(AddUser)
