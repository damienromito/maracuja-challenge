import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'

const HomePage = () => {
  const history = useHistory()

  return (
    <div>
      <h1>Maracuja Dashboard</h1>

      <Link to={ROUTES.SIGN_IN}>Connectez-vous</Link>

    </div>
  )
}

export default HomePage
