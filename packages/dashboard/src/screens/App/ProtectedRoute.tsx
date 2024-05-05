import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Redirect, Route } from "react-router-dom"
import ROUTES from "../../constants/routes"

const ProtectedRoute = ({ component: Component, roles, needAuth, ...rest }) => {
  const { authUser } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()

  const checkVerifiedEmail = () => {
    if (
      currentChallenge &&
      authUser &&
      currentChallenge.verifyEmail &&
      !authUser.emailVerified &&
      authUser.providerData[0].providerId === "password"
    ) {
      // if (currentChallenge && authUser && currentChallenge.verifyEmail && authUser.providerData[0].providerId === 'password') {
      return false
    } else {
      localStorage.removeItem("authStates")
      return true
    }
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (needAuth) {
          if (!authUser) {
            return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          } else if (!checkVerifiedEmail()) {
            // if (currentChallenge && authUser && currentChallenge.verifyEmail && authUser.providerData[0].providerId === 'password') {
            return (
              <Redirect to={{ pathname: ROUTES.SIGN_UP__EMAILPASSWORD_VALIDATION, state: { email: authUser.email } }} />
            )
          }
        }

        return <Component {...props} />

        // check if route is restricted by role
        // if (roles && roles.indexOf(currentUser.role) === -1) {
        //     // role not authorised so redirect to home page
        //     return <Redirect to={{ pathname: '/'}} />
        // }
      }}
    />
  )
}

export default ProtectedRoute
