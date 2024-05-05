import React from 'react'
import { FormGroup } from '../../../components'
import FieldContainer from '../../../components/FormikFieldContainer'

export default () => {
  // const { values } = props

  return (
    <>
      <FormGroup>
        <h4>Pousser la mise à jour l'application</h4>
        <FieldContainer name='requiredAppBuild.appFlow' label='AppFlow : Entrez le BuildId indiqué dans AppFlow (ex : 7230952)' type='number' />
        <FieldContainer name='requiredAppBuild.ios' label='IOS : Entrez le numéro de build disponible sur le store (ex : 47)' type='text' />
        <FieldContainer name='requiredAppBuild.android' label='Android : Entrez le numéro de build disponible sur le store (ex : 47)' type='text' />
      </FormGroup>

    </>
  )
}
