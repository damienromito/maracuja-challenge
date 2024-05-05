import { useCurrentOrganisation, useAuthUser } from "@maracuja/shared/contexts"
import { Tabs, TabsProps } from "antd"
import { useState } from "react"
import Admins from "./Admins"
import General from "./General"
import { USER_ROLES } from "@maracuja/shared/constants"

const { TabPane } = Tabs
export default () => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { onSignOut, authUser } = useAuthUser()

  // const formik = useFormikContext<any>()
  const [general, setGeneral] = useState<any>(null)

  const onChange = (key) => {}

  const items: TabsProps["items"] = [
    {
      key: "general",
      label: "General",
      children: <General />,
    },
  ]
  if (authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
    items.push({
      key: "admins",
      label: "Admins",
      children: <Admins />,
    })
  }

  return (
    <>
      <h3>Configuration : {currentOrganisation.name}</h3>

      <Tabs defaultActiveKey="1" onChange={onChange} items={items} />
    </>
  )
}
