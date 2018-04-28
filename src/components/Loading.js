import Box  from 'grommet/components/Box'
import Label  from 'grommet/components/Label'
import Spinning  from 'grommet/components/icons/Spinning'

const Loading = ({isLoading, error}) => {
  if (isLoading) {
    return <Box align='center'><Spinning size='medium' /></Box>
  } else if (error) {
    return <Box align='center'><Label>Sorry, there was a problem loading the page.</Label></Box>
  } else {
    return null
  }
}
