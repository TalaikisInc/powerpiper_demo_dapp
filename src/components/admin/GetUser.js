import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

import Toast from 'grommet/components/Toast'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import TextInput from 'grommet/components/TextInput'
import Button from 'grommet/components/Button'
import Label  from 'grommet/components/Label'
import Form  from 'grommet/components/Form'
import Table  from 'grommet/components/Table'
import TableHeader  from 'grommet/components/TableHeader'
import TableRow  from 'grommet/components/TableRow'
import Image  from 'grommet/components/Image'

import { decrypt } from '../../utils/crypto'

class GetUser extends Component {
  constructor() {
    super()
    this.state = {
      modalOpen: null,
      success: '',
      failure: '',
      userCount: '',
      user: '',
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: '',
      phone: '',
      docType: '',
      docNo: '',
      addressDocument: '',
      idDocument: ''
    }

    this.handleIDSubmit = this.handleIDSubmit.bind(this)
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getUsersCount = this.getUsersCount.bind(this)
  }

  componentDidMount() {
    this.getUsersCount()
  }
  
  getUsersCount() {
    this.props.Token.deployed().then(async (token) => {
      token.getUserCount().then((res) => {
        this.setState({
          userCount: res ? res.toNumber() : 0
        })
      })
    })

    setTimeout(() => {
        this.getUsersCount()
    }, 2000)
  }

  handleChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState({
      [name]: value
    })
  }

  handleIDSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if(this.state.userId >= 0) {
        token.getUserAtIndex(this.state.userId, { from: this.props.account })
          .then(async (res) => {
            const _decryptedHash = await decrypt(res[2], process.env.REACT_APP_HASH_PASS)
            this.props.ipfs.catJSON(_decryptedHash, async (err, data) => {
              if(err) {
                // console.log(err)
                this.setState({
                  modalOpen: true,
                  failure: `Error occurred: ${err.message}`
                })
              } else {
                const _obj = JSON.parse(await decrypt(data, process.env.REACT_APP_ENCRYPTION_PASS))
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
                  idDocument: _obj.idDocument
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
      } else {
        this.setState({
          modalOpen: true,
          failure: 'Please check the form.'
        })
      }
    })
  }

  handleAddressSubmit(event) {
    event.preventDefault()

    this.props.Token.deployed().then(async (token) => {
      if(web3utils.isAddress(this.state.user)) {
        token.getUser(this.state.user, { from: this.props.account }).then(async (res) => {
          const _decryptedHash = await decrypt(res[1], process.env.REACT_APP_HASH_PASS)
          this.props.ipfs.catJSON(_decryptedHash, async (err, data) => {
            if(err) {
              // console.log(err)
              this.setState({
                modalOpen: true,
                failure: `Error occurred: ${err.message}`
              })
            } else {
              const _obj = JSON.parse(await decrypt(data, process.env.REACT_APP_ENCRYPTION_PASS))
              this.setState({
                userId: res[0].toNumber(),
                user: this.state.user,
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
                idDocument: _obj.idDocument
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
      } else {
        this.setState({
          modalOpen: true,
          failure: 'Please check the form.'
        })
      }
    })
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Get User</Heading>
        <Label>Found { this.state.userCount } user(s).</Label>

        <Table>
          <TableHeader labels={['Data', 'Value']} sortIndex={0} />
          <tbody>
            <TableRow>
              <td>No.</td>
              <td>{ this.state.userId ? this.state.userId : '' }</td>
            </TableRow>
            <TableRow>
              <td>ETH address</td>
              <td>{ this.state.user ? this.state.user : '' }</td>
            </TableRow>
            <TableRow>
              <td>Email</td>
              <td>{ this.state.email ? this.state.email : '' }</td>
            </TableRow>
            <TableRow>
              <td>First name</td>
              <td>{ this.state.firstName ? this.state.firstName : '' }</td>
            </TableRow>
            <TableRow>
              <td>Last name</td>
              <td>{ this.state.lastName ? this.state.lastName : '' }</td>
            </TableRow>
            <TableRow>
              <td>Address</td>
              <td>{ this.state.address ? this.state.address : '' }</td>
            </TableRow>
            <TableRow>
              <td>City</td>
              <td>{ this.state.city ? this.state.city : '' }</td>
            </TableRow>
            <TableRow>
              <td>Country</td>
              <td>{ this.state.country ? this.state.country : '' }</td>
            </TableRow>
            <TableRow>
              <td>Phone</td>
              <td>{ this.state.phone ? this.state.phone : '' }</td>
            </TableRow>
            <TableRow>
              <td>Document type</td>
              <td>{ this.state.docType ? this.state.docType : '' }</td>
            </TableRow>
            <TableRow>
              <td>Document no.</td>
              <td>{ this.state.docNo ? this.state.docNo : '' }</td>
            </TableRow>
            <TableRow>
              <td>ID document</td>
              <td>{ this.state.idDocument ? <Image src={this.state.idDocument} /> : '' }</td>
            </TableRow><TableRow>
              <td>Address confirmation</td>
              <td>{ this.state.addressDocument ? <Image src={this.state.addressDocument} /> : '' }</td>
            </TableRow>
          </tbody>
        </Table>

        <Form onSubmit={this.handleIDSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="userId">By ID:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='userId'
              type='number'
              step='1'
              onDOMChange={this.handleChange}
              value={this.state.userId}
              name='userId'
              placeHolder='User ID'/>
          </Box>
          <Box pad='small' align='center'>
            <Button primary={true} type='submit' label='Get' />
          </Box>
        </Form>
        <Form onSubmit={this.handleAddressSubmit}>
          <Box pad='small' align='center'>
            <Label labelFor="address">By Address:</Label>
          </Box>
          <Box pad='small' align='center'>
            <TextInput
              id='address'
              type='text'
              onDOMChange={this.handleChange}
              value={this.state.user}
              name='user'
              placeHolder='User Address'/>
          </Box>
          <Box pad='small' align='center'>
            <Button primary={true} type='submit' label='Get' />
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
    ipfs: state.ipfs,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(GetUser)
