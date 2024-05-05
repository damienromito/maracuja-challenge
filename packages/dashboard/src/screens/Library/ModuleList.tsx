import { Module } from "@maracuja/shared/models"
import { List } from "antd"
import { useState } from "react"
import { useRouteMatch } from "react-router-dom"
import useListener from "../../hooks/useListener"
import ModuleItem from "./ModuleItem"

export default () => {
  const match = useRouteMatch<any>()
  const [modules, setModules] = useState<any>([])

  useListener(() =>
    Module.fetchAll(
      { organisationId: match.params.organisationId },
      {
        listener: (objects) => {
          if (!objects) return
          setModules(objects)
        },
      }
    )
  )

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
      }}
      dataSource={modules}
      renderItem={(module) => <ModuleItem module={module} />}
    />
  )
}
