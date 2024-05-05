import { DeleteTwoTone } from "@ant-design/icons"
import { useCurrentChallenge, useCurrentOrganisation, useAuthUser } from "@maracuja/shared/contexts"
import { objectSubset } from "@maracuja/shared/helpers"
import { ChallengeSettings } from "@maracuja/shared/models"
import { Button, List, notification, Select } from "antd"
import firebase from "firebase/app"
import "firebase/firestore"
import moment from "moment"
import { useState } from "react"
import { useDashboard } from "../../contexts"

interface StaffPickerProps {
  staff?: any
}
export default ({ staff }: StaffPickerProps) => {
  const { currentChallenge } = useCurrentChallenge()

  const handleDelete = async (admin) => {
    if (window.confirm("Supprimer " + admin.firstName) === true) {
      await ChallengeSettings.update(
        { challengeId: currentChallenge.id, id: "general" },
        { [`staff.${admin.id}`]: firebase.firestore.FieldValue.delete() }
      )
    }
  }

  return (
    <>
      <h5>Rapport de challenge</h5>
      <ReportSender />
      <p>Liste des admins recevant ce rapport :</p>

      <SearchInput placeholder="Ajouter un admin" />

      <List
        itemLayout="horizontal"
        dataSource={staff}
        renderItem={(admin: any) => (
          <List.Item actions={[<DeleteTwoTone onClick={() => handleDelete(admin)} />]}>
            <List.Item.Meta title={admin.firstName} description={admin.email} />
          </List.Item>
        )}
      />
    </>
  )
}

const { Option } = Select
const SearchInput = (props) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { currentChallenge } = useCurrentChallenge()

  const [admins, setAdmins] = useState<any>([])

  const loadAdmins = async () => {
    const admins = await currentOrganisation.fetchAdmins()
    if (admins) {
      setAdmins(admins)
    }
  }

  const handleChange = async (adminId) => {
    const admin = admins.find((admin) => admin.id === adminId)
    await ChallengeSettings.update(
      { challengeId: currentChallenge.id, id: "general" },
      { [`staff.${adminId}`]: objectSubset(admin, ["firstName", "lastName", "email"]) }
    )
  }

  const options = admins?.map((admin) => <Option key={admin.id}>{admin.firstName}</Option>)
  return (
    <Select
      showSearch
      placeholder={props.placeholder}
      defaultActiveFirstOption={false}
      showArrow={true}
      filterOption={false}
      onSearch={loadAdmins}
      onChange={handleChange}
      notFoundContent={null}
    >
      {options}
    </Select>
  )
}

const ReportSender = () => {
  const { authUser } = useAuthUser()

  const { currentChallenge } = useCurrentChallenge()

  const { setLoading, challengeSettings } = useDashboard()

  const handleSendAdminReport = async () => {
    if (window.confirm("Un email sera envoyé aux staff du challenge (voir configuration) ") === true) {
      setLoading(true)
      await currentChallenge.sendAdminReport()
      setLoading(false)
      notification.open({ message: "Rapport envoyé aux admins !" })
    }
  }
  const handleSendAdminReportTest = async () => {
    setLoading(true)
    await currentChallenge.sendAdminReport({ testEmail: "admin@maracuja.ac" })
    setLoading(false)
    notification.open({ message: "Rapport envoyé à admin@maracuja.ac !" })
  }

  const lastSendAt = challengeSettings?.adminReport?.lastSendAt?.toDate()
  return (
    <>
      <Button onClick={handleSendAdminReport}>📩 Envoyer le rapport aux admins</Button>
      <Button onClick={handleSendAdminReportTest}>Test</Button>
      {!!lastSendAt && authUser.isSuperAdmin() && (
        <p>
          <i>Dernier rapport envoyé le {moment(lastSendAt).format("DD MMM YYYY à H:mm:ss")}</i>
        </p>
      )}
    </>
  )
}
