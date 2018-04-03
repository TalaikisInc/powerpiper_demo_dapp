import React, { Component } from 'react'
import { connect } from 'react-redux'

import OrdersAdmin from './OrdersAdmin'
import RedeemsAdmin from './Redeems'
import TokensAvailabilityAdmin from './TokensAvailability'
import CertificatesAdmin from './Certificates'
import PriceMarkupAdmin from './PriceMarkup'

class ExchangeAdmin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOwner: null
    }
  }

  componentDidMount() {
    this.props.Exchange.deployed().then((exchange) => {
      exchange.validate(this.props.account)
        .then((res) => {
          this.setState({
            isOwner: res
          })
        })
    })
  }

  render() {
    return (
      <div>
        <div>
          { this.state.isOwner
            ? <div>
              <div>
                <h3>Orders</h3>
                <OrdersAdmin />
              </div>

              <div>
                <h3>Redeems</h3>
                <RedeemsAdmin />
              </div>

              <div>
                <h3>Tokens availability</h3>
                <TokensAvailabilityAdmin />
              </div>

              <div>
                <h3>Energy price markup</h3>
                <PriceMarkupAdmin />
              </div>

              <div>
                <h3>Certificates</h3>
                <CertificatesAdmin />
              </div>

            </div>
            : <div><h2>This area is admin only</h2></div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Token: state.Token,
    Crowdsale: state.Crowdsale,
    Exchange: state.Exchange,
    account: state.account
  }
}

export default connect(mapStateToProps)(ExchangeAdmin)
