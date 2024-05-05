import { useCurrentChallenge } from '@maracuja/shared/contexts'
import React from 'react'
import CropImageField from '../../../components/CropImageField'
import FieldContainer from '../../../components/FormikFieldContainer'
import DatesField from './DatesField'
import DescriptionEditor from './DescriptionEditor'
import DisplayDatePicker from './DisplayDatePicker'

export default ({ currentId }) => {
  const { currentChallenge } = useCurrentChallenge()

  return (

    <>
      <FieldContainer label='Titre' name='title' type='text' />
      <DescriptionEditor label="Description de l'evenement" name='description' />
      <h6>Image de l'evenement</h6>
      <CropImageField name='image' showUrl imageName='image' folderName={`challenges/${currentChallenge.id}/events/${currentId}`} size={{ width: 800, height: 400 }} />
      <h6>Date de l'activité</h6>
      <DatesField>
        <DisplayDatePicker name='eventStartDate' label='Date du rendez-vous' />
        <DisplayDatePicker name='eventEndDate' label='Date de fin' />
      </DatesField>
    </>

  )
}
