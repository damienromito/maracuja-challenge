import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { callApi, objectSubset } from "@maracuja/shared/helpers"
import { Button } from "antd"
import { Form, Formik } from "formik"
import M from "materialize-css"
import moment from "moment"
import { useState } from "react"
import { Tab, Tabs } from "react-materialize"
import { Link } from "react-router-dom"
import FieldContainer from "../../components/FormikFieldContainer"
import { useDashboard } from "../../contexts"
import GamesList from "./GamesList"

export default ({ item, challengeId, details = false }) => {
  const { setLoading } = useDashboard()
  const { currentChallenge } = useCurrentChallenge()
  const [preview] = useState<any>(!details) // useState<any>(JSON.parse(localStorage.getItem('challenge')))

  const onDeletePlayer = () => {
    if (window.confirm("Supprimer le joueur ?") === true) {
      item.delete(challengeId, item.id).then(() => {
        M.toast({ html: "Joueur déinscrit !" })
      })
    }
  }

  const onClickSendNotif = async (values, { setSubmitting }) => {
    try {
      const data = {
        template: objectSubset(values, ["title", "message", "redirect"]),
        playerId: item.id,
        audience: "none",
        challengeId: challengeId,
      }
      await callApi("apiNotificationsSendToPlayer", data)
    } catch (error) {
      M.toast({ html: "Erreur, check logs" })
    }

    M.toast({ html: "Notification envoyée" })
    setSubmitting(true)
  }
  const completion = item.scores && item.scores.training ? Math.round(item.scores.training.score * 100) : 0
  let games = []
  if (item.questionSets) {
    Object.keys(item.questionSets).flatMap((key) => {
      const qs = item.questionSets[key]
      if (qs.participations) {
        games = games.concat(qs.participations)
      }
    })
    games.sort((a, b) => b.createdAt - a.createdAt)
  }

  const handleGeneratePlayerCard = async () => {
    setLoading(true)
    await item.generateCard()
    setLoading(false)
    M.toast({ html: "Carte générée" })
  }

  const removeCaptainRole = async () => {
    if (window.confirm("Enlever le role de " + currentChallenge.wording?.captain + "?")) {
      setLoading(true)
      const response = await item.removeCaptainRole()
      setLoading(false)
    }
  }

  const handleBecomeCaptain = async () => {
    if (window.confirm("Nommer " + currentChallenge.wording?.captain + "?")) {
      setLoading(true)
      const response = await item.becomeCaptain()
      setLoading(false)
    }
  }

  return (
    <li className="collection-item">
      <div className="row">
        <div className="col s4">
          <>
            {preview && <img src={item.avatar?.getUrl("100")} width="30" />}
            {!preview && item.avatar && (
              <div>
                {item.cardUrl ? (
                  <img src={item.cardUrl} width="200" />
                ) : (
                  <>
                    <img src={item.avatar?.getUrl("300")} width="100" />
                    <br />
                    {process.env.REACT_APP_FUNCTIONS_EMULATOR && (
                      <button onClick={handleGeneratePlayerCard}>Generer la carte</button>
                    )}
                  </>
                )}
              </div>
            )}

            <i className="left material-icons ">assignment_ind</i>
            <p>
              <Link to={`/challenges/${challengeId}/players/${item.id}`}>{`${item.username} (${item.firstName || ""} ${
                item.lastName || ""
              } 👕 n°${item.number})`}</Link>
            </p>
            <p>
              <Link to={`/users/${item.id}`}> Voir l'utilisateur </Link>
            </p>
            <p>
              <a
                href={`https://console.firebase.google.com/u/0/project/maracuja-english-challenge/firestore/data/~2Fchallenges~2F${challengeId}~2Fplayers~2F${item.id}`}
                target="_blanck"
              >
                Voir sur Firebase
              </a>
            </p>

            {item.avatar?.get}
            {item.role && <p>{item.role}</p>}
            <p>Id : {item.id}</p>

            {item.referer && (
              <p>
                👶🏻 Parrain :
                <Link to={`/challenges/${challengeId}/players/${item.referer.id}`} target="_blank">
                  {" "}
                  {item.referer.username}{" "}
                </Link>
              </p>
            )}
            {item.referralCode && (
              <div>
                <p>Code de parrainage : {item.referralCode}</p>
                <p>{item.refereeCount || 0} filleuls</p>
              </div>
            )}
            {item.birthday && <span>{moment().diff(item.birthday, "years")} ans</span>}
            {item.licenseNumber && <p>{item.licenseNumber}</p>}
          </>

          <p>{item.email && item.email}</p>
          <p>{item.phoneNumber}</p>

          {item.club && (
            <>
              {/* {item.club.image}
              <img src={item.club.image ? require('../../../images/clubs/'+ item.club.image) : ""} /> */}
              <Link
                to={`/challenges/${challengeId}/teams/${item.club.id}`}
                className="black white-text waves-effect waves-light"
              >
                <i className=" left material-icons ">flag</i>
                {item.club.name}
              </Link>
            </>
          )}
          {item.roles?.indexOf("CAPTAIN") !== -1 ? (
            <>
              <p>
                <i className="left material-icons red-text">assistant</i> CAPTAIN
              </p>
              <Button onClick={removeCaptainRole}>Enlever le role de {currentChallenge.wording?.captain}</Button>
            </>
          ) : (
            <Button onClick={handleBecomeCaptain}>Nommer capitaine</Button>
          )}
        </div>

        <div className="col s4">
          <p>Taux d'engagement {Math.round(item.questionSetEngagment?.rate * 100) || 0}% </p>
          <p>
            <i className="left material-icons ">local_play</i>
            {item.gameCount || 0} parties ({item.scores?.trainings?._stats?.count || 0} entrainements -
            {item.scores?.contests?._stats?.count || 0} épreuves)
          </p>
          <p>version {item.appVersion?.version}</p>
          {completion === 0 ? (
            <p>
              <i className="left material-icons gray-text">star_border</i> 0%
            </p>
          ) : (
            <>
              <p>
                {completion < 100 ? (
                  <i className="left material-icons yellow-text">star_half</i>
                ) : (
                  <i className="left material-icons green-text">star</i>
                )}
                entrainé à {completion}%
              </p>
              <p>
                <i className="left material-icons ">date_range</i>Joué le{" "}
                {moment(item.playedAt.toDate()).format("DD/MM à H:mm")}
              </p>
            </>
          )}

          {item.scores && item.scores.competition && (
            <p>
              <i className="left material-icons yellow-text">star</i>
              {item.scores.competition.score} POINTS
            </p>
          )}
        </div>

        <div className="col s4">
          <p>
            <i className="left material-icons ">date_range</i> Inscrit le{" "}
            {moment(item.createdAt).format("DD MMM YYYY à H:mm:ss")}
          </p>
          <p>
            <i className="left material-icons ">date_range</i> Edité le{" "}
            {moment(item.editedAt).format("DD MMM YYYY à H:mm:ss")}
          </p>
          <p>Platform {item.platform || "non définie"}</p>
          <p>Device Id {item.deviceId ? `${item.deviceId} (${item.deviceIdIdenticalCount || 1})` : "non définie"}</p>

          <p> </p>
          <>
            <p>
              FCMToken {item.acceptNotification && <span>(accept notif)</span>}
              {item.fcmToken ? (
                <input
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement
                    target.select()
                    document.execCommand("copy")
                    M.toast({ html: "Token copié" })
                  }}
                  defaultValue={item.fcmToken}
                />
              ) : (
                "non définie'"
              )}
            </p>
          </>
        </div>
      </div>

      {!preview && (
        <>
          {item.fcmToken && (
            <div>
              <h2>Envoyer une notification</h2>
              <Formik
                initialValues={{ title: "Hello", message: "Une notifcation", redirect: "/" }}
                onSubmit={onClickSendNotif}
              >
                {(props) => {
                  return (
                    <Form style={{ padding: 20 }}>
                      <FieldContainer name="title" type="text" label="Titre de la notification" />
                      <FieldContainer name="message" label="Message" component="textarea" />
                      <FieldContainer
                        name="redirect"
                        type="text"
                        label="Url de redirection (ex : /challenge/club ou /, ...)"
                      />

                      <button type="submit" className="btn grey darken-4" disabled={props.isSubmitting}>
                        Envoyer
                      </button>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          )}
          <Tabs>
            <Tab title={`Épreuves (${item.contestCount || 0})`}>
              <GamesList type={ACTIVITY_TYPES.CONTEST} playerId={item.id} challengeId={challengeId} />
              {/* <GamesList activities={item.contests} /> */}
            </Tab>
            <Tab title={`Entrainements (${item.trainingCount || 0})`}>
              <GamesList type={ACTIVITY_TYPES.TRAINING} playerId={item.id} challengeId={challengeId} />
            </Tab>

            <Tab title={`Debriefings (${item.debriefingCount || 0})`}>
              <GamesList type={ACTIVITY_TYPES.DEBRIEFING} playerId={item.id} challengeId={challengeId} />
            </Tab>
          </Tabs>

          <div>
            <button onClick={() => onDeletePlayer()}>Désinscrire le joueur du challenge</button>
            <p>Cette action ne supprimera pas l'utilisateur</p>
          </div>
        </>
      )}
    </li>
  )
}
