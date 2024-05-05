import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '.'

export default () => {
  const history = useHistory()

  return (
    <div style={{ textAlign: 'center', padding: 16 }}>
      <br />
      <h1>Cette page n'existe pas ou tu n'y as pas accès !</h1>
      <br />
      <br />
      <Button onClick={() => history.push('/')}>Aller à l'accueil</Button>
    </div>
  )
}
