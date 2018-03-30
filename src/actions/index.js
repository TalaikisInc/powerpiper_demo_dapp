import contract from 'truffle-contract'
//import TokenArtifact from '../contracts/token.json'
//import CrowdsaleArtifact from '../contracts/crowdsale.json'

const path = require('path')
const TokenArtifact = path.resolve('../../../build/contracts/PowerPiperToken.json')
const CrowdsaleArtifact = path.resolve('../../../build/contracts/PowerPiperCrowdsale.json')

export function initWeb3() {
  const { web3 } = window
  const { Web3 } = window

  if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
    const provider = web3.currentProvider
    // let provider2 = new Web3.providers.HttpProvider('http://127.0.0.1:8545');

    const web3Initiated = new Web3(provider)

    return {
      type: 'INIT_WEB3',
      payload: {
        web3Initiated,
        web3,
        provider
      }
    }
  }

  return {
    type: 'INIT_WEB3',
    payload: {
      web3Initiated: null,
      web3InitiatedLocal: null,
      web3: null,
      provider: null
    }
  }
}

export function initToken(payload) {
  const instance = contract(TokenArtifact)

  if (payload.provider) {
    instance.setProvider(payload.provider);
  }

  return {
    type: 'INIT_TOKEN',
    payload: instance
  }
}

export function initCrowdsale(payload) {
  const instance = contract(CrowdsaleArtifact)

  if (payload.provider) {
    instance.setProvider(payload.provider)
  }

  return {
    type: 'INIT_CROWDSALE',
    payload: instance
  }
}

export function fetchAccount(payload) {
  return (dispatch) => {
    if (payload.web3) {
      payload.web3.eth.getCoinbase((err, account) => {
        if (err === null) {
          dispatch({
            type: 'FETCH_ACCOUNT',
            payload: (account !== null ? account : 'empty')
          })
        } else {
          dispatch({
            type: 'FETCH_ACCOUNT',
            payload: null
          })
        }
      });
    } else {
      dispatch({
        type: 'FETCH_ACCOUNT',
        payload: null
      })
    }
  }
}
