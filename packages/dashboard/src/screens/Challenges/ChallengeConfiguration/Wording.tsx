import React from 'react'
import FieldContainer from '../../../components/FormikFieldContainer'
import challengeDefaultValues from './challengeDefaultValues'

const ChallengeConfigTabGeneral = () => {
  return (
    <>
      {/* <FieldContainer name='navBarHomeTitle' label="Titre de la page d'accueil d'un challenge (Laisser vide pour afficher le logo maracuja)" type='text' placeholder='Vestiaire, Challenge, Accueil' /> */}

      {Object.keys(challengeDefaultValues.wording).map(wordingKey => {
        const placeholder = challengeDefaultValues.wording[wordingKey]
        return <FieldContainer key={wordingKey} name={`wording.${wordingKey}`} label={`${wordingKey} (${placeholder})`} type='text' />
      })}

    </>
  )
}

export default ChallengeConfigTabGeneral
