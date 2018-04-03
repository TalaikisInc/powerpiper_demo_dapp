export default (state = [], action) => {
  switch (action.type) {
    case 'INIT_VAULT':
      return action.payload
    default:
      return state
  }
}
