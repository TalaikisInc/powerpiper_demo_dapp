import React, { Component } from 'react'
import { connect } from 'react-redux'

import PriceMarkupAdmin from './PriceMarkup'
// import CrowdsaleCreationAdmin from './CrowdsaleCreation'

/*
More universal component for Crowdsales instead of migrations.
Needs to only connect owner validaiton to token.
*/
class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOwner: null
    }
  }

  componentDidMount() {
    this.props.Crowdsale.deployed().then((crowdsale) => {
      //crowdsale.validate(this.props.account)
        //.then((res) => {
          this.setState({
            // isOwner: res
            isOwner: true
          })
        //})
    })
  }

  render() {
    return (
      <div>
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
