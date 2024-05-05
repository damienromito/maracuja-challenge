import { Button, List, Modal } from "antd"
import "firebase/firestore"
import React, { useState } from "react"

export default ({ onPicked }) => {
  const [showModal, setShowModal] = useState<any>(false)

  const onClose = () => {
    setShowModal(false)
  }

  const data = [
    {
      title: "Parraine un.e ami.e ! 😎",
      message:
        'Invite un.e ami.e pour vous aider à gagner et découvrir Aquitel ! ✊ Partage ton code parrainage depuis la page "Equipe" clique sur le bouton "Inviter" 🚀',
    },
    {
      title: "💡 Recrute tes co-équipiers",
      message:
        "N'oublie pas d'inviter tes co-équipiers et donner un maximum de chances à l'équipe de gagner🏆 Clique sur le bouton + dans la liste des \"joueurs à recruter\" 💪 Go Go Go 🚀",
    },
    {
      title: "🙃 Ton équipe est-elle au complet ?",
      message:
        "C'est bientôt l'heure de la épreuve mais ton équipe est-elle au complet ? 🏆 Clique sur le bouton + dans la liste des \"joueurs à recruter\" 💪 Go Go Go 🚀",
    },
    {
      title: "Motive tes joueurs ✊",
      message:
        'En tant que capitaine, tu as le pouvoir de motiver tes coéquipiers : Utilise le bouton "✊motive ton équipe" pour leur envoyer un message personnalisé ! Une bonne façon pour les accompagner pour cette 1ère épreuve 🔥',
    },
    {
      title: "Le score est serré..",
      message: "...et des joueurs de ton équipe peuvent encore jouer ! 😎 L'épreuve #2 se termine ce soir 🔥 Go !",
    },
    {
      title: "Découvre ton équipe 👋",
      message:
        "Quelles anecdotes sont vraies ou fausses ? Crée une question sur toi et découvre celles de tes coéquipiers ! 🤩 Utilise le bouton en haut de la page équipe ➡️",
    },
    {
      title: "📣 Bonne journée de formation 😎",
      message: "Profite bien de cette journée 💪 et défends les couleurs de ton équipe 🚀💪",
    },
    {
      title: "👋👋 Félicite tes joueurs !",
      message:
        '✊ Tes coéquipiers adorent recevoir un message de félicitations ! Utilise le bouton "✊motive ton équipe" pour leur envoyer un message personnalisé ! Un bon moyen de souder l\'équipe dans les épreuves qui démarrent🔥',
    },
    {
      title: "Tes joueurs dorment ?! 😴",
      message:
        "En tant que capitaine, tu as le pouvoir de réveiller tes coéquipiers qui n'ont pas encore joué aujourd'hui ! Utilise le bouton \"📣 Debout\" à côté du nom de chaque joueur endormi !",
    },
    {
      title: "🔥 Astuce très importante pour l'esprit d'équipe",
      message:
        "👋 Hello Capitaine ! N'oublie pas de définir le logo et le nom de ton équipe : c'est très important pour l'esprit d'équipe et les épreuves qui commencent dès demain🏆",
    },
    {
      title: "📣 Le challenge est terminé",
      message:
        "👋 Bravo pour ta participation 🏆 Consulte le classement et n'oublie pas de féliciter tes coéquipiers et l'autre équipe 🤩",
    },
    {
      title: "C'est l'heure du bilan 🥰",
      message: "Comment c'était ? Aide-nous à améliorer les futures formations !",
    },
    {
      title: "📣 Ton débriefing est disponible",
      message: "👉 Revois tes erreurs ! Cela te permet, au calme 😌 de bien préparer la future épreuve 👊",
    },
    {
      title: "⏰ fin du débriefing",
      message:
        "Plus que quelques heures pour revoir tes erreurs sur la dernière épreuve ! Cela te permet, au calme 😌 de bien préparer la suite 👊",
    },
    {
      title: "H-2 ⏰ fin de l'épreuve du jour",
      message: "Tu n'as pas encore joué et l'épreuve se termine bientôt ! Go 🔥",
    },
    {
      title: "📣 L'épreuve du jour a commencé !",
      message:
        "Participe à l'épreuve du jour et gagne des points pour ton équipe 🔥 60 secondes pour répondre à un max de questions",
    },
    {
      title: "L'équipe gagnante est ...",
      message:
        "Le challenge est terminé, bravo à tous pour votre participation ! 🎖️Meilleure joueuse : Flo avec 21 points - 🎖️ Joueur le plus engagé : Dieu des pingouins avec une participation à 100% des quiz",
    },
    {
      title: "📣 Débriefing final",
      message: "Cela te permet, au calme, de tes erreurs pendant 7 jours après le challenge 💪",
    },
  ]

  const handlePick = (item) => {
    onPicked(item)
    setShowModal(false)
  }
  return (
    <>
      <Button type="link" onClick={() => setShowModal(true)}>
        {" "}
        Choisir un modèle de notification{" "}
      </Button>
      <Modal
        title="Modèles de notification"
        visible={showModal}
        destroyOnClose
        okButtonProps={{ hidden: true }}
        onCancel={onClose}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.message} />
              <Button key="pick" type="primary" onClick={() => handlePick(item)}>
                Choisir
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}
