import React from "react"
import { Redirect, Route } from "react-router-dom"
import { useAuthUser } from "../../contexts"

// interface ProtectedRouteTypes = { component: ReactNode; roles : Array<string>; [x:any]: any;  }

const ProtectedRoute = ({ component: Component, roles, ...rest }: any) => {
  const { authUser } = useAuthUser()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authUser) {
          return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
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
