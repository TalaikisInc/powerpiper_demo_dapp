import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

import Heading from 'grommet/components/Heading'
import Box  from 'grommet/components/Box'
import Table  from 'grommet/components/Table'
import TableRow  from 'grommet/components/TableRow'
import TableHeader  from 'grommet/components/TableHeader'
import Image  from 'grommet/components/Image'

import { decrypt } from '../utils/crypto'

class User extends Component {
  constructor(props) {
    super(props)

    this.state = {
      failure: '',
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

    this.getUserData = this.getUserData.bind(this)
  }

  componentDidMount() {
    this.getUserData()
  }

  getUserData() {
    this.props.Token.deployed().then(async (token) => {
      if(web3utils.isAddress(this.props.account)) {
          token.getUser(this.props.account, { from: this.props.account })
            .then(async (res) => {
              const _decryptedHash = await decrypt(res[1], process.env.REACT_APP_HASH_PASS)
              this.props.ipfs.catJSON(_decryptedHash, async (err, data) => {
                if(err) {
                  // console.log(err)
                  this.setState({
                    modalOpen: true,
                    failure: `Error occured: ${err.message}`
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
                failure: `Error occured: ${error.message}`
              })
            })
        } else {
          this.setState({
            modalOpen: true,
            failure: 'Wrong account.'
          })
        }
      })

    setTimeout(() => {
      this.getUserData()
    }, 5000)
  }

  render() {
    return (
      <Box>
        { this.state.email !== '' ? <div>
          <Heading>Your Data</Heading>

          <Table>
            <TableHeader labels={['Data', 'Value']} sortIndex={0} />
            <tbody>
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
          </div>
          :
          '' }
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

export default connect(mapStateToProps)(User)
