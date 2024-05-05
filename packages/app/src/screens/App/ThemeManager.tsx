import React, { useEffect, useState } from "react"
import { ThemeProvider } from "styled-components"
import { useCurrentChallenge, useCurrentOrganisation, useDevice } from "../../contexts"
import GlobalStyles from "../../styles/global-styles"
import { cros, defaultTheme, edf, grandTournoi, jib2022, scp2019, lrr, ca } from "../../styles/themes"

const ThemeManager = (props) => {
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const { appOrganisationId } = useDevice()

  const [activeTheme, setActiveTheme] = useState<any>(defaultTheme)

  useEffect(() => {
    if (activeTheme && currentChallenge) {
      activeTheme.primary = currentChallenge.colors?.primary
      activeTheme.secondary = currentChallenge.colors?.secondary
    }
  }, [activeTheme, currentChallenge])

  useEffect(() => {
    const theme = currentChallenge?.theme || currentOrganisation?.theme || getOrganisationTheme(appOrganisationId)

    switch (theme) {
      case "jib2022":
        setActiveTheme(jib2022)
        break
      case "scp2019":
        setActiveTheme(scp2019)
        break
      case "grandtournoi":
        setActiveTheme(grandTournoi)
        break
      case "edf":
        setActiveTheme(edf)
        break
      case "ca":
        setActiveTheme(ca)
        break
      case "lrr":
        setActiveTheme(lrr)
        break
      case "cros":
        setActiveTheme(cros)
        break
      default:
        setActiveTheme(defaultTheme)
        break
    }
  }, [currentChallenge, currentOrganisation])

  return (
    activeTheme && (
      <ThemeProvider theme={activeTheme}>
        <GlobalStyles {...activeTheme} />
        {props.children}
      </ThemeProvider>
    )
  )
}

const getOrganisationTheme = (organisationId) => {
  switch (organisationId) {
    case "cros-na":
      return "cros"
    default:
      return null
  }
}
export default ThemeManager
