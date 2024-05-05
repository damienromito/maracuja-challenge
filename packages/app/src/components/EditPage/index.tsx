import { Button } from "@maracuja/shared/components"
import { Form, Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import { Container, Title4 } from "../../components"
import { ROUTES } from "../../constants"
import NavRoute from "../../screens/Team/Edit/style/NavRoute"
import PageContent from "../../screens/Team/Edit/style/PageContent"
import NavBar from "../NavBar"
import EditNav from "./style/EditNav"

interface EditPageProps {
  formValues?: any
  onSubmitForm?: any
  pagesRoute?: any
  titleForm?: any
  onFinish?: any
}
const EditPage = ({ formValues, onSubmitForm, pagesRoute, titleForm, onFinish }: EditPageProps) => {
  const { path, url } = useRouteMatch<any>()
  const history = useHistory()
  const match: any = useRouteMatch<any>(`${url}/:editFormId`)

  const [matchValue, setMatchValue] = useState<any>(false)

  useEffect(() => {
    if (match) {
      setMatchValue(match.params.editFormId)
    }
  }, [match])

  return (
    <>
      <Formik initialValues={formValues} onSubmit={onSubmitForm} enableReinitialize>
        {(formik) => {
          return (
            <>
              <NavBar
                leftAction={() => history.push(ROUTES.HOME)}
                leftText="Annuler"
                rightAction={() => (onFinish ? onFinish(formik) : history.push(ROUTES.HOME))}
                rightText="Terminer"
                title={titleForm}
              />
              <PageContent>
                <Container>
                  <EditNav>
                    {pagesRoute.map((page: any, i: number) => {
                      return (
                        <NavRoute key={i} selected={matchValue === page.params}>
                          <Link to={`${url}/${page.params}`}>
                            <i className={`icon icon-${page.icon}`} />
                            <Title4>{`${page.title}`}</Title4>
                          </Link>
                        </NavRoute>
                      )
                    })}
                  </EditNav>
                  <Switch>
                    <Route exact path={path}>
                      {pagesRoute[0] && <Redirect to={`${path}/${pagesRoute[0].params}`} />}
                    </Route>
                    <Route path={`${path}/:editFormId`}>
                      <Form id="EditForm" style={{ textAlign: "center" }}>
                        {pagesRoute.map((page: any, i: number) => {
                          return (
                            page.params === matchValue && (
                              <React.Fragment key={i}>
                                <div>{page.component}</div>
                                <Button
                                  button
                                  disabled={
                                    formik.isSubmitting || !formik.dirty || formik.values === formik.initialValues
                                  }
                                  hidden={page.saveButton !== "true" || page.saveButton === "false"}
                                  onClick={() => {
                                    !formik.isSubmitting && formik.submitForm()
                                  }}
                                  primary
                                  style={{ marginTop: "15px" }}
                                >
                                  Enregistrer
                                </Button>
                              </React.Fragment>
                            )
                          )
                        })}
                      </Form>
                    </Route>
                  </Switch>
                </Container>
              </PageContent>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default EditPage
