import React from "react"
import { useCurrentChallenge, useCurrentOrganisation, useDevice } from "../contexts"
import { RegularLink } from "./"
import { getMailToLink } from "../utils/helpers"

const HelpLink = (props) => {
  const { email, subject, cc, body, footer, label } = props
  const { currentPlayer, currentChallenge, currentTeam } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const { info } = useDevice()

  const getBody = () => {
    // platform === 'ios' && info.osVersion \r\n
    const lbreak = "%0d%0a"
    const subjectParam = `${subject || "J'ai besoin d'aide"}`
    let bodyParam =
      `${body || "Hello, j'aurais besoin d'aide pour... "}` +
      `${lbreak}${lbreak}${lbreak}${lbreak}${lbreak}` +
      `- - - - ${lbreak}` +
      `${footer || ""} ${lbreak}` +
      `${currentChallenge ? `Challenge : ${currentChallenge.name}${lbreak}` : ""}` +
      `${currentOrganisation ? `(${currentOrganisation.name})` : ""}` +
      `${currentTeam ? `Nom  ${currentChallenge?.wording?.ofTheTribe} : ${currentTeam.name} ${lbreak} ` : ""}` +
      `${currentPlayer?.licenseNumber || ""}` +
      lbreak +
      `${currentPlayer?.email || ""}` +
      lbreak
    if (info) {
      bodyParam += `Device : ${info.operatingSystem}_${info.osVersion} ${info.manufacturer}_${info.model}${lbreak}`
    }
    bodyParam += `Version de l'app : ${info.appVersion || ""} (${process.env.REACT_APP_VERSION})${lbreak}`

    if (label) {
      bodyParam += `${lbreak} depuis ${label}`
    }

    const result = getMailToLink({ email: email || "bonjour@maracuja.ac", body: bodyParam, cc, subject: subjectParam })

    return result
  }

  return (
    <RegularLink {...props} href={getBody()}>
      {props.children || "J'ai besoin d'aide supplémentaire"}
    </RegularLink>
  )
}

export default HelpLink
{
  /* MAILTO GENERATOR https://www.jezweb.info/mailto.html */
}
