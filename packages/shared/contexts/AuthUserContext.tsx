/*
 * SHARED CONTEXT
 */
import firebase from "firebase/app"
import "firebase/auth"
import React, { useContext, useEffect, useState } from "react"
import { USER_ROLES } from "../constants"
import { User } from "../models"
import useObjectListener from "./useObjectListener"

const AuthUserContextProvider = (props) => {
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(new User(JSON.parse(localStorage.getItem("authUser")))) // useState<any>(null) //
  const [authUserId, setAuthUserId] = useState<any>(null)
  const [currentOrganisation] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const { object: currentUser, init: initUser, error: currentUserError, clear: clearUser } = useObjectListener()

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((userData) => {
      if (userData) {
        onGetAuthCurrentUser()
      } else {
        cleanUser()
      }
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authUserId) {
      initUser(User, { id: authUserId })
    }
  }, [authUserId])

  useEffect(() => {
    if (currentUser || currentUserError) {
      if (currentUser) {
        delete currentUser.roles
      }
      const mergedData = currentUser ? Object.assign(currentUser, firebaseAuthUser) : firebaseAuthUser
      localStorage.setItem("authUser", JSON.stringify(mergedData))
      setAuthUser(mergedData)
    }
  }, [currentUser, firebaseAuthUser, currentUserError])

  const onGetAuthCurrentUser = async () => {
    const userData = firebase.auth().currentUser
    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult()
    const data = {
      id: userData.uid,
      email: userData.email,
      emailVerified: userData.emailVerified,
      providerData: userData.providerData,
      roles: idTokenResult.claims.roles,
    }
    setFirebaseAuthUser(data)
    firebase.analytics().setUserId(data.id)
    setAuthUserId(data.id)
  }

  const reloadAuthCurrentUser = () => {
    firebase
      .auth()
      ?.currentUser?.reload()
      .then(() => {
        if (firebase.auth().currentUser?.emailVerified) {
          onGetAuthCurrentUser()
        }
      })
  }

  const isSuperAdmin = () => {
    return authUser?.roles?.includes(USER_ROLES.SUPER_ADMIN)
  }

  const userHasOrgaRole = (roles) => {
    if (isSuperAdmin) return true
    if (currentOrganisation) {
      return roles.some((role) => currentOrganisation.roles?.includes(role))
    } else {
      return false
    }
  }

  const cleanUser = () => {
    clearUser()
    localStorage.removeItem("authUser")
    localStorage.removeItem("savedStates")
    setAuthUser(null)
    setAuthUserId(null)
    setFirebaseAuthUser(null)
  }

  const handleSignOut = () => {
    localStorage.removeItem("authUser")
    return firebase
      .auth()
      .signOut()
      .then(() => {
        return cleanUser()
      })
  }

  return (
    <AuthUserContext.Provider
      value={{
        authUser,
        authUserId,
        authUserLoading: loading,
        userHasOrgaRole,
        onSignOut: handleSignOut,
        reloadAuthCurrentUser,
      }}
    >
      {!loading && props.children}
    </AuthUserContext.Provider>
  )
}

const useAuthUser = () => useContext(AuthUserContext)
const AuthUserContext = React.createContext<any>(null)

export { AuthUserContextProvider, useAuthUser }
