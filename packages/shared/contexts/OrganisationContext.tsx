/*
 * SHARED CONTEXT
 */

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuthUser } from "."
import { ORGA_ROLES, USER_ROLES } from "../constants"
import { Member, Organisation, User } from "../models"
import useObjectListener from "./useObjectListener"

const OrganisationContext = createContext<any>(null)

const OrganisationContextProvider = (props) => {
  const { authUser } = useAuthUser()
  const {
    object: currentOrganisation,
    clear: clearOrganisation,
    init: initOrganisation,
    error: organisationError,
  } = useObjectListener()

  const [currentOrganisationLoading, setCurrentOrganisationLoading] = useState<any>(false)
  const [currentMember, setCurrentMember] = useState<any>(false)
  useEffect(() => {
    const savedOrganisationId = localStorage.getItem("organisationId")
    if (savedOrganisationId) {
      setCurrentOrganisationById(savedOrganisationId)
    }
  }, [])

  useEffect(() => {
    if (currentOrganisation) {
      if (authUser && authUser instanceof User) {
        loadMember()
      }
      setCurrentOrganisationLoading(false)
    }
  }, [currentOrganisation, authUser])

  useEffect(() => {
    if (organisationError) {
      setCurrentOrganisationLoading(false)
    }
  }, [organisationError])

  const loadMember = () => {
    let memberData
    if (authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
      memberData = { roles: [ORGA_ROLES.ADMIN] }
    } else if (authUser.organisations?.[currentOrganisation.id]) {
      const organisationMemberInfos = authUser.organisations[currentOrganisation.id]
      memberData = { ...organisationMemberInfos }
    }

    if (memberData) {
      const member = new Member(memberData)
      setCurrentMember(member)
    }
  }
  // ACTIONS
  const setCurrentOrganisationById = (organisationId) => {
    if (currentOrganisationLoading) return
    if (currentOrganisation) clearOrganisation()
    if (organisationId) {
      setCurrentOrganisationLoading(true)
      localStorage.setItem("organisationId", organisationId)
      initOrganisation(Organisation, { id: organisationId })
    } else {
      localStorage.removeItem("organisationId")
    }
  }

  return (
    <OrganisationContext.Provider
      value={{
        setCurrentOrganisationById,
        currentOrganisation,
        currentMember,
        currentOrganisationLoading,
      }}
    >
      {props.children}
    </OrganisationContext.Provider>
  )
}

const useCurrentOrganisation = () => useContext(OrganisationContext)

export { OrganisationContext, useCurrentOrganisation, OrganisationContextProvider }
