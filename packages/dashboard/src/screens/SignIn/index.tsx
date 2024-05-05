import maracujaLogo from "@maracuja/shared/images/maracujaLogo.svg"
import { Button, Form, Input } from "antd"
import firebase from "firebase/app"
import React, { useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { ROUTES } from "../../constants"

export default () => {
  const [error, setError] = useState<any>(null)
  const history = useHistory()

  const onSubmit = async (values) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(values.email, values.password)
    } catch (error) {
      setError(error)
    }
  }

  const handleResetPassword = () => {
    history.push(ROUTES.RESET_PASSWORD)
  }

  return (
    <Wrapper>
      <img src={maracujaLogo} width="120" />
      <br />
      <br />
      <Form
        onFinish={onSubmit}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
            },
          ]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password placeholder="Mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Se connecter
          </Button>
        </Form.Item>
      </Form>
      {error && <div>{error.message}</div>}
      <Button type="link" onClick={handleResetPassword}>
        Redefinir votre mot de passe
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 300px;
  background: #ddd;
  margin: auto;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
`
