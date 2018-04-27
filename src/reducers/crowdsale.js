export default (state = [], action) => {
  switch (action.type) {
    case 'INIT_CROWDSALE':
      return action.payload
    default:
      return state
  }
}
