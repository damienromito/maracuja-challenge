import { Form, Formik } from "formik"
import React, { useMemo } from "react"
import { CheckboxField } from "../../components"
import CropImageField from "../../components/CropImageField"
import FieldContainer from "../../components/FormikFieldContainer"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { getGeoFromZipCode } from "../../utils/clubs"

interface ClubFormProps {
  item: any
  onSaveItem: any
  onToggleEditMode?: any
  regions: any
  departments: any
  tribes: any
}

const ClubForm = ({ item = {}, onSaveItem, onToggleEditMode, regions, departments, tribes }: ClubFormProps) => {
  const { currentChallenge } = useCurrentChallenge()

  // const [club, setClub] = useState<any>(null)

  // useEffect(() => {
  //   if (item?.id) {
  //     loadClub()
  //   }
  // }, [item])

  // const loadClub = async () => {
  //   const res = await api.fetchClub({ clubId: item.id })
  //   setClub(res)
  // }

  const handleSubmitForm = async (values) => {
    const data = { ...values }

    const geo = getGeoFromZipCode(data.zipCode, { regions, departments })
    if (geo) {
      data.department = geo.department
      data.departmentId = geo.department.id
      data.region = geo.region
      data.regionId = geo.region.id
    }
    if (data.updateChallenge && (values.image !== item.image || values.name !== item.name)) {
      delete data.updateChallenge
      await item.update(data)
    }

    return onSaveItem(data)
  }

  const initValues = useMemo(() => {
    const values: any = {
      id: item.id || "",
      name: item.name || "Aucun nom",
      logo: { ...item.logo } || {},
      zipCode: item.zipCode || "",
      tribe: item.tribe || "",
      nbLicensees: item.nbLicensees || 0,
      city: item.city || "",
      departmentCode: item.departmentCode || "",
      departmentId: item.departmentId || "",
      nameVariations: item.nameVariations || "",
      updateChallenge: false,
    }

    if (currentChallenge && item?.challengeIds?.includes(currentChallenge.id)) {
      values.updateCurrentTeam = true
    }
    return values
  }, [])

  const displayGeoInfos = (zipCode) => {
    const geo = getGeoFromZipCode(zipCode, { regions, departments })
    return geo && `${geo.department.name} (${geo.department.code}) - ${geo.region.name}`
  }

  const handleSelectTribe = (e, props) => {
    const tribeId = e.target.value
    const tt = tribes.find((x) => x.id === tribeId) || ""
    props.setFieldValue("tribe", tt)
  }
  return (
    item && (
      <>
        <Formik initialValues={initValues} enableReinitialize onSubmit={handleSubmitForm}>
          {(props) => {
            return (
              <Form style={{ padding: 20 }}>
                <FieldContainer label="Nom du Club*" name="name" type="text" />
                {!item.id && (
                  <FieldContainer
                    label="Identifiant (laisser vide pour le generer automatiquement)"
                    name="id"
                    type="text"
                  />
                )}
                <FieldContainer
                  className="browser-default"
                  component="select"
                  label="Type de tribu"
                  name="tribe"
                  value={props.values.tribe?.id}
                  onChange={(e) => handleSelectTribe(e, props)}
                >
                  {/* <option disabled value=''> -- Selectionnez un type de club -- </option> */}
                  <option key="none" value="">
                    Aucune
                  </option>
                  {tribes.map((tribe) => {
                    return (
                      <option key={tribe.id} value={tribe.id}>
                        {tribe.name}
                      </option>
                    )
                  })}
                </FieldContainer>
                <FieldContainer label="Ville" name="city" type="text" />
                <FieldContainer label="Code postal" name="zipCode" type="text" />
                <p>{displayGeoInfos(props.values.zipCode)}</p>

                <CropImageField
                  name="logo.original"
                  imageName="logo"
                  folderName={`clubs/${item.id}`}
                  size={{ width: 600, height: 600 }}
                />

                <FieldContainer
                  label="Nombre de licenciés du Club"
                  name="nbLicensees"
                  style={{ marginBottom: "15px" }}
                  type="text"
                />
                <FieldContainer label="Mot clés pour trouver le club" name="nameVariations" type="text" />
                {currentChallenge && Object.keys(item).length > 0 && (
                  <p>
                    <CheckboxField
                      name="updateChallenge"
                      label={`Mettre à jour la team dans le challenge "${currentChallenge.name}"`}
                    />{" "}
                  </p>
                )}

                <button className="btn grey darken-4" type="submit">
                  Enregistrer
                </button>
                {onToggleEditMode && (
                  <button className="btn right grey darken-4" onClick={onToggleEditMode}>
                    Annuler
                  </button>
                )}
              </Form>
            )
          }}
        </Formik>
      </>
    )
  )
}

export default ClubForm
