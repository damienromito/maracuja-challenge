import { Challenge } from "@maracuja/shared/models"
import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { ROUTES } from "../constants"
import { useCurrentChallenge } from "../contexts"

import { App } from "@capacitor/app"

const DeepLinkManager = (props) => {
  const { setCurrentChallengeById } = useCurrentChallenge()
  const history = useHistory()

  useEffect(() => {
    App.addListener("appUrlOpen", (data) => {
      checkDeepLink(data)
    })
  }, [])

  const checkDeepLink = async (data) => {
    let url = data.url
    // for ios let url = 'https://crosna.page.link/?link=https://app.maracuja.ac/join/vivelesjeux&apn=ac.maracuja.crosna&isi=1568520883&ibi=ac.maracuja.crosna&st=Rejoins-moi+sur+le+challenge+%23ViveLesJeux&sd=Salut+!+Rejoins-moi+pour+participer+au+challenge+Maracuja+sur+la+nouvelle+application+Sport+Challenge+CROS+Nouvelle-Aquitaine+!+%F0%9F%94%A5&si=https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/challenges%252Fcros-na%252Fjournedelolympisme%252Fsharing%252Fimage.jpg?alt%3Dmedia%26token%3Db7bb0e25-f755-4371-a994-36c4fa08c38f&cid=9146313154259768324&_osl=https://crosna.page.link/vivelesjeux&_fpb=CKwGEPcCGgVmci1mcg==&_cpt=cpit&_iumenbl=1&_iumchkactval=1&_plt=333&_uit=3660&_cpb=1&_fpb=CKwGEPcCGgVmci1mcg==&_cpt=cpit&_iumenbl=1&_iumchkactval=1&_plt=333&_uit=1079945&_cpb=1'
    if (url) {
      url = new URL(url)
    }

    // if (url.host === (currentOrganisation?.dynamicLinkHost || process.env.REACT_APP_DYNAMIC_LINK_HOST)) {
    const params = url.searchParams
    if (params?.get("_osl")) {
      url = new URL(params?.get("_osl"))
    }
    const key = url.pathname.substr(1)

    if (key === "email-verified") {
      history.push(ROUTES.SIGN_UP__EMAIL_VERIFIED)
    } else if (key === "join") {
      history.push(ROUTES.HOME)
    } else {
      const params = url.searchParams
      const referralCode = params?.get("code")
      if (referralCode) {
        await joinChallengeByCode(key, true)
        history.push(ROUTES.SIGN_UP_REFERRAL + "?code=" + referralCode)
      } else {
        await joinChallengeByCode(key)
        history.push(ROUTES.HOME)
      }
    }
  }

  const joinChallengeByCode = async (code = "", isReferral = false) => {
    const queryProperty = `${isReferral ? "dynamicLinkReferral" : "dynamicLink"}.code`
    const challenges = await Challenge.fetchAll({}, { refHook: (ref) => ref.where(queryProperty, "==", code) })
    const challenge = challenges.length > 0 ? challenges[0] : null

    if (challenge) {
      setCurrentChallengeById(challenge.id)
      return true
    } else {
      history.push(ROUTES.HOME)
      return true
    }
  }

  return <>{props.children}</>
}

export { DeepLinkManager }
