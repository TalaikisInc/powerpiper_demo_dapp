import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
const SHOW_CERTIFICATES_AT_A_TIME = 6

class Certificates extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { certificates: [], showMoreButton: false }
    this.showMoreClicks = 1

    this.fetchCertificates = this.fetchCertificates.bind(this)
    this.showMore = this.showMore.bind(this)
  }

  componentDidMount() {
    this.fetchCertificates(1)
  }

  fetchCertificates() {
    let certificates = []
    const that = this
    let added = 0
    let toAdd = 0

    function addCertificate(res, i) {
      certificates.push({
        key: i,
        url: res[0],
        amount: res[1].toNumber() / 1000,
        timestamp: res[2].toNumber()
      })

      certificates = _.orderBy(certificates, ['key'], ['desc'])
      added += 1

      // if (i === 0 || certificates.length === that.showMoreClicks * SHOW_CERTIFICATES_AT_A_TIME) {
      if (added === toAdd) {
        that.setState({ certificates })
      }

      if (i === 0) {
        that.setState({ showMoreButton: false })
      }
    }

    this.props.Crowdsale.deployed().then((crowdsale) => {
      crowdsale.getCertificatesLength({ from: this.props.account })
        .then((totalRes) => {
          const total = totalRes.toNumber()

          if (total > SHOW_CERTIFICATES_AT_A_TIME) {
            this.setState({ showMoreButton: true })
          }

          if (total < SHOW_CERTIFICATES_AT_A_TIME) {
            toAdd = total
          } else {
            toAdd = this.showMoreClicks * SHOW_CERTIFICATES_AT_A_TIME

            if (toAdd > total) {
              toAdd = total
            }
          }

          for (let i = total - 1; (i >= total - (this.showMoreClicks * SHOW_CERTIFICATES_AT_A_TIME)) && (i >= 0); i -= 1) {
            crowdsale.getCertificate(i, { from: this.props.account })
              .then((res) => {
                addCertificate(res, i)
              })
          }
        })
    })
  }

  showMore() {
    this.showMoreClicks += 1
    this.fetchCertificates()
  }

  render() {
    const certificates = this.state.certificates.map(certificate => (
      <tr key={certificate.url + certificate.timestamp}>
        <td><font color="white"><a href={certificate.url} style={{ color: 'white' }} target="_blank">{certificate.url}</a></font></td>
        <td><font color="white">{certificate.amount} grams</font></td>
        <td><font color="white">{moment.unix(certificate.timestamp).fromNow()}</font></td>
      </tr>
    ));

    return (
      <div>
        <h4>Certificates</h4>
        { certificates.length
          ? <div>
            <table>
              <thead>
                <tr style={{ fontWeight: 300 }}>
                  <th>URL</th>
                  <th>Amount</th>
                  <th>Time added</th>
                </tr>
              </thead>
              <tbody>
                {certificates}
              </tbody>
            </table>

            { this.state.showMoreButton &&
              <div>
                <button
                  href="#"
                  onClick={this.showMore}>
                Show more
                </button>
              </div>
            }
          </div>
          : <div>
            <h5>No certificates added</h5>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    Crowdsale: state.Crowdsale,
    Token: state.Token,
    account: state.account
  }
}

export default connect(mapStateToProps)(Certificates)
