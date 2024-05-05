import { USER_ROLES } from "@maracuja/shared/constants"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { User } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useRouteMatch } from "react-router"
import { FormGroup } from "../../components"
import FieldContainer from "../../components/FormikFieldContainer"

export default () => {
  const match = useRouteMatch<any>()
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)

  const handleSubmit = async (values) => {
    setLoading(true)
    await user.updateUser({ data: values })
    setLoading(false)
  }

  useEffect(() => {
    if (!user) {
      init()
    }
  }, [])

  const init = async () => {
    setLoading(true)
    await User.fetch(
      { id: match.params.userId },
      {
        listener: (u) => {
          setUser(u)
          setLoading(false)
        },
      }
    )
  }

  const handleAddAdmin = async () => {
    setLoading(true)

    await user.addRole({
      challengeId: currentChallenge.id,
      organisationId: currentOrganisation.id,
      role: USER_ROLES.ADMIN,
    })
    setLoading(false)
  }

  if (loading) return <span>"loading"</span>
  return (
    <li className="active">
      <h2>{user.username || "non défini"}</h2>

      <Formik
        initialValues={{
          username: user.username || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }}
        onSubmit={handleSubmit}
      >
        {(props) => {
          return (
            <Form>
              <FieldContainer name="username" type="text" label="Nom d'utilisateur" />
              <FieldContainer name="firstName" type="text" label="Prénom" />
              <FieldContainer name="lastName" type="text" label="Nom " />
              {currentChallenge && currentOrganisation && (
                <FormGroup>
                  <h6>
                    Challenge actif : {currentChallenge.name} ({currentOrganisation.name})
                  </h6>
                  {user.organisations?.[currentOrganisation.id]?.challenges?.includes(currentChallenge.id) ? (
                    <p>{user.username} est admin</p>
                  ) : (
                    <p>
                      {" "}
                      <button onClick={handleAddAdmin} className="btn grey darken-4">
                        Ajouter {user.username} en tant qu'admin
                      </button>
                    </p>
                  )}
                </FormGroup>
              )}
              {/* {user.organisations} */}
              <p>
                {" "}
                <button type="submit" className="btn grey darken-4">
                  Enregistrer
                </button>
              </p>
            </Form>
          )
        }}
      </Formik>
    </li>
  )
}
