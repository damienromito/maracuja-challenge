import { IonContent, IonPage } from '@ionic/react'
import { Field, Form, Formik } from 'formik'
import firebase from 'firebase/app'

import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

import { Button } from 'antd';
import {Text2} from  '@maracuja/shared/components'
import { useLocation } from 'react-router-dom';
import FormikErrorLabel from '../../components/FormikErrorLabel';
import styled from 'styled-components';
import { ErrorLabel } from '@maracuja/shared/components';

const ERROR_CODE_ACCOUNT_NOT_FOUND = 'auth/user-not-found'
const ERROR_MESSAGE_ACCOUNT_NOT_FOUND = 'Aucun compte n\'existe pour cet adresse e-mail.'

export default () => {
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(null)
  const [authError, setAuthError] = useState(null)

  let formInput = null

  useEffect(() => {
    if (formInput) formInput.focus()
  }, [])

  const formSchema = Yup.object().shape({
    // email: Yup.string().email("L'email n'est pas correct")
    email: Yup.string().required('L\'email n\'est pas correct').matches(/^[A-Z0-9._%+-]+@(?!yopmail.com)[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'L\'email n\'est pas correct')
    // .matches(/.*@(?!yopmail\.com).*$/g, "L'email n'est pas correct")
  })

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(false)
    const emailValue = values.email.trim().toLowerCase()

    setLoading(true)

    firebase.auth().sendPasswordResetEmail(emailValue, {
      url: "https://dashboard.maracuja.ac",
    })
      .then(() => {
        setLoading(false)
        setEmail(emailValue)
      })
      .catch(error => {
        setLoading(false)
        if (error.code === ERROR_CODE_ACCOUNT_NOT_FOUND) {
          setAuthError(ERROR_MESSAGE_ACCOUNT_NOT_FOUND)
        }
      })
  }

  return (
    
<Wrapper>
      <h4>Definissez votre mot de passe</h4>
          <Text2>Indiquez ci-dessous l'e-mail avec lequel vous êtes inscrit ; vous recevrez un e-mail contenant un lien vous permettant de renseigner votre nouveau mot de passe.</Text2>
          <br />
          {!email
            ? <><Formik
                initialValues={{ email: location?.state?.email || '' }}
                validationSchema={formSchema}
                onSubmit={onSubmit}
                >
              {props => {
                const { errors, touched, isSubmitting, dirty } = props
                return (
                  <Form>
                    <Field
                      innerRef={(input) => { formInput = input }}
                      type='email'
                      name='email'
                      placeholder='Adresse email'
                    />
                    <FormikErrorLabel errors={errors} touched={touched} value='email' />
                    <Button type="primary" htmlType="submit" disabled={isSubmitting}>Valider</Button>
                    
                  </Form>
                )
              }}

                </Formik>

              </>
            : <p style={{ textAlign: 'center' }}>Un email vous permettant de renseigner votre nouveau mot de passe a été envoyé à {email}.</p>}
      
      </Wrapper>        
  )
}


const Wrapper = styled.div`
  width : 300px;
  background : white;
  margin : auto;
  border-radius: 8px;
  padding: 40px;
  text-align:center;

`