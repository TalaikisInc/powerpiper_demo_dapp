import contract from 'truffle-contract'
import IPFS from 'ipfs-mini'

import TokenArtifact from '../contracts/PowerPiperToken.json'
import CrowdsaleArtifact from '../contracts/PowerPiperCrowdsale.json'

export function initWeb3() {
  const { web3 } = window
  const { Web3 } = window

  if (typeof Web3 !== 'undefined') {
    let provider
    if(typeof web3 !== 'undefined') {
      provider = web3.currentProvider
    } else {
      provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    }

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

export function initIPFS(payload) {
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  })

  return {
    type: 'INIT_IPFS',
    payload: ipfs
  }
}

export function initToken(payload) {
  const instance = contract(TokenArtifact)

  if (payload.provider) {
    instance.setProvider(payload.provider)
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
      })
    } else {
      dispatch({
        type: 'FETCH_ACCOUNT',
        payload: null
      })
    }
  }
}

export function fetchGasPrice(payload) {
  return (dispatch) => {
    if (payload.web3) {
      payload.web3.eth.getGasPrice((err, gasPrice) => {
        if (err === null) {
          dispatch({
            type: 'FETCH_GAS',
            payload: (gasPrice !== null && payload.web3.fromWei(gasPrice, 'gwei') > 0.1 ? gasPrice : payload.web3.toWei(0.1, 'gwei'))
          })
        } else {
          dispatch({
            type: 'FETCH_GAS',
            payload: null
          })
        }
      })
    } else {
      dispatch({
        type: 'FETCH_GAS',
        payload: null
      })
    }
  }
}
