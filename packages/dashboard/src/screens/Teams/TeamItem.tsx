import { ClubAvatar } from '@maracuja/shared/components'
import { useCurrentChallenge } from '@maracuja/shared/contexts'
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'

export default ({ item }) => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <li className='collection-item'>

      <div className='row'>
        <div className='col s2'>
          <ClubAvatar logo={item.logo?.getUrl('120')} size={60} />
        </div>
        <div className='col s8'>
          <Link to={`/challenges/${currentChallenge.id}/teams/${item.id}`} className='black white-text waves-effect waves-light'>
            <i className=' left material-icons '>flag</i>{item.name}
          </Link>
          {item.createdAt &&
            <p>Inscrite le {moment(item.createdAt).format('DD MMM YYYY à H:mm:ss')} </p>}
          {/*
          {item.department &&
            <p>{item.department.name} ({item.region && item.region.name})</p>} */}
          <p>
            {item.playerCount || '0'} joueurs /
            {item.captainCount || '0'} captains /
            {item.refereeCount || '0'} recrues
          </p>
          {/* <p><i className='left material-icons '>location_on</i> {item.city || ''} {item.zipCode || item.departmentCode || ''}</p> */}

        </div>
      </div>
    </li>
  )
}
