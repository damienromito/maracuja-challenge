import React from 'react'
import 'react-datasheet-grid/dist/style.css'
import { FormGroup } from '../../components'

export default ({ teams, members }) => {
  return !teams
    ? null
    : (
      <FormGroup className='right'>
        {teams?.map(team => {
          const playerCount = team.playerCount || 0
          const memberCount = Object.keys(team.members || {})?.length || 0
          const totalString = `${playerCount}/${memberCount + playerCount} inscrits`

          let definedCaptainCount = team.captainCount || 0
          if (members) {
            definedCaptainCount += members?.reduce((count, m) => {
              return m.team === team.id && m.captain ? count + 1 : count
            }, 0)
          }

          return <p key={team.id}>{team.name || team.id} ({totalString} - ✊ {definedCaptainCount} capitaines)</p>
        })}
      </FormGroup>
      )
}
