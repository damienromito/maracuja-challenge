import moment from "moment"
import { ConfirmModal } from "../../components"

export default ({ item, onClickEdit, onClickSend, onClickTest, challenge, onDeleteItem, challengeId }) => {
  return (
    <li className={`collection-item ${item.to === "users" && "blue lighten-3"} `}>
      <div className="row">
        <div className="col s4">
          <p>
            <i className="left material-icons ">notifications</i>
            <strong>{item.name}</strong>
          </p>

          {item.sentAt && <p>Envoyé le {moment(item.sentAt.toDate()).format("DD/MM à H:mm")}</p>}
          {item.testAt && <p>Testé le {moment(item.testAt.toDate()).format("DD/MM à H:mm")}</p>}
        </div>
        <div className="col s4">
          <p> {item.message} </p>
        </div>
        <div className="col s4">
          <div className="right">
            <button onClick={onClickEdit} className="btn" disabled={item.sentAt ? true : false}>
              <i className="tiny material-icons ">edit</i>
            </button>
            &nbsp;
            <ConfirmModal
              confirmAction={() => onClickSend(item.id)}
              trigger={
                <button className="btn" type="button" disabled={item.sentAt ? true : false}>
                  <i className="tiny material-icons ">send</i>
                </button>
              }
              title={`Envoyer le message ${item.name} ?`}
            >
              <p>
                <strong>Destinataire :</strong>
                {item.to === "all" && "Tout le monde (" + challenge.userCount + ")"}
              </p>
              <p>
                <strong>Message :</strong> {item.message}
              </p>
            </ConfirmModal>
            &nbsp;
            <ConfirmModal
              confirmAction={() => onClickTest(item.id)}
              trigger={
                <button className="btn" type="button">
                  Test
                </button>
              }
              title={`Tester le message ${item.name} ?`}
            >
              <p>
                <strong>Destinataire :</strong> Damien & Vincent
              </p>
              <p>
                <strong>Message :</strong> {item.message}
              </p>
            </ConfirmModal>
          </div>
        </div>
      </div>
    </li>
  )
}
