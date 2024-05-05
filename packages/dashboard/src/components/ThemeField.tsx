import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { Module } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import FieldContainer from "./FormikFieldContainer"
import { objectSubset } from "@maracuja/shared/helpers"

export default ({ label = "Compétence" }) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const [themes, setThemes] = useState<any>([])
  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    const modules = await Module.fetchAll({ organisationId: currentOrganisation.id })
    if (!modules) return
    const themesData = []
    for (const module of modules) {
      for (const theme of module.themes) {
        themesData.push(objectSubset(theme, ["id", "name"]))
      }
    }
    setThemes(themesData)
  }
  return (
    <FieldContainer className="browser-default" component="select" name="themeId" label={label}>
      <option value={undefined}>Non défini</option>
      {themes.map((theme) => {
        return (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        )
      })}
    </FieldContainer>
  )
}
