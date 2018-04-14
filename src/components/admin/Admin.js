import React, { Component } from 'react'
import { connect } from 'react-redux'

import PriceMarkupAdmin from './PriceMarkup'
// mroe universdal deployment solution:
// import CrowdsaleCreationAdmin from './CrowdsaleCreation'

/*
@TODO should implemet owner validation
*/
class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOwner: null
    }
  }

  componentDidMount() {
    this.props.Token.deployed().then((token) => {
      token.validate(this.props.account)
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
        { this.state.isOwner
          ? <div>
            <div>
              <h3>Crowdsale setup</h3>
              { /*
              <CrowdsaleCreationAdmin />
              */ }
            </div>

            <div>
              <h3>Energy price markup</h3>
              <PriceMarkupAdmin />
            </div>

          </div>
          : <div><h2>This area is admin only</h2></div>
        }
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

export default connect(mapStateToProps)(Admin)
