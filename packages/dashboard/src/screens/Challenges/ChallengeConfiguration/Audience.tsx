import { WHITELIST_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { objectSubset } from "@maracuja/shared/helpers"
import { ClubProperty } from "@maracuja/shared/models"
import { Field, FieldArray, useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { CheckboxField, Spinner } from "../../../components"
import FieldContainer from "../../../components/FormikFieldContainer"

export default () => {
  const formik = useFormikContext<any>()
  const [clubProperties, setClubProperties] = useState(null)
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const whitelistLocalStorageKey = "whitelistGSheetId-" + currentChallenge.id
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentOrganisation.clubProperties && !clubProperties) {
      loadFiltersData()
    }
  }, [formik.values?.audience?.whitelist])

  const loadFiltersData = async () => {
    const data = {}
    for (const propertyId of currentOrganisation.clubProperties) {
      const property = await ClubProperty.fetch({ id: propertyId })
      data[propertyId] = property
    }
    setClubProperties(data)
  }

  const whitelistType = formik.values.audience?.whitelist
  return (
    <>
      {loading && <Spinner />}
      <FieldContainer
        component="select"
        className="browser-default"
        name="audience.whitelist"
        label="Restreintre le challenge (licenciers, liste privée, ..."
      >
        {/* <option value> -- Selectionnez -- </option> */}
        <option value={WHITELIST_TYPES.NONE}>Entrée libre</option>
        <option value={WHITELIST_TYPES.MAILING_LIST}>Liste blanche (emails)</option>
        <option value={WHITELIST_TYPES.FFE_LICENSEES}>Licences FFE</option>
      </FieldContainer>

      {[WHITELIST_TYPES.MAILING_LIST, WHITELIST_TYPES.FFE_LICENSEES].includes(whitelistType) && (
        <>
          <FieldContainer
            name="audience.whitelistMessage"
            type="text"
            label="Message avant de demander l'accès au challenge"
          />
        </>
      )}

      {whitelistType === WHITELIST_TYPES.MAILING_LIST && (
        <>
          <p>
            <CheckboxField
              name="audience.whitelistWithPhoneNumber"
              label="Demander le numéro de téléphone des participants"
            />{" "}
          </p>
          <p>
            <CheckboxField
              name="audience.whitelistWithCaptains"
              label={`Definir les ${currentChallenge.wording?.captains} depuis la liste des participants`}
            />{" "}
          </p>
          <p>
            <CheckboxField
              name="audience.whitelistWithTeams"
              label={`Definir les ${currentChallenge.wording?.tribes} depuis la liste des participants`}
            />{" "}
          </p>
        </>
      )}

      {(whitelistType === WHITELIST_TYPES.NONE || whitelistType === WHITELIST_TYPES.FFE_LICENSEES) && clubProperties && (
        <>
          <FieldContainer name="audience.searchPickerHelp" type="text" label="Message d'aide pour trouver son équipe" />
          <h4>Filtres d'audience</h4>
          <FieldContainer
            name="audience.clubCellPropertyInBadge"
            type="text"
            label="Proprieté du club à afficher dans le badge du résultat de recherche"
          />
          {/* <FieldContainer name='audience.leaguePickerClubProperty' type='text' label='Proprieté du club de préselection (vide si desactivé)' /> */}
          {Object.keys(clubProperties).map((propertyId) => {
            const clubProperty = clubProperties[propertyId]
            return <FilterFieldArray key={propertyId} clubProperty={clubProperty} />
          })}
        </>
      )}
    </>
  )
}

const FilterFieldArray = ({ clubProperty }) => {
  const formik = useFormikContext<any>()

  const handleSelectAll = () => {
    formik.setFieldValue(
      `audience.filters.${clubProperty.id}`,
      clubProperty.values.map((value) => {
        return objectSubset(value, ["id", "name", "region_code", "code"])
      })
    )
  }
  const handleUnSelectAll = () => {
    formik.setFieldValue(`audience.filters.${clubProperty.id}`, [])
  }
  return (
    <div>
      <h5>{clubProperty.name}</h5>
      {formik.values.audience.filters?.[clubProperty.id]?.length ? (
        <button type="button" onClick={handleUnSelectAll}>
          Décocher tout{" "}
        </button>
      ) : (
        <button type="button" onClick={handleSelectAll}>
          Cocher tout{" "}
        </button>
      )}
      {/* @ts-ignore */}
      <FieldArray name={`audience.filters.${clubProperty.id}`}>
        {(arrayHelpers) => (
          <div>
            {clubProperty.values.map((filterValue, index) => {
              filterValue = objectSubset(filterValue, ["id", "name", "region_code", "code"])
              const currentValuesFilter =
                formik.values.audience?.filters && formik.values.audience?.filters[clubProperty.id]
              return (
                <div key={filterValue.id}>
                  <label>
                    <Field
                      name={`audience.filters.${clubProperty.id}.${index}`}
                      type="checkbox"
                      value={filterValue.id}
                      checked={currentValuesFilter?.find((selectedFilter) => selectedFilter.id === filterValue.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          arrayHelpers.push(filterValue)
                        } else {
                          const idx = currentValuesFilter?.findIndex(
                            (selectedFilter) => selectedFilter.id === filterValue.id
                          )
                          arrayHelpers.remove(idx)
                        }
                      }}
                    />
                    <span>{filterValue.name}</span>
                  </label>
                </div>
              )
            })}
          </div>
        )}
      </FieldArray>
    </div>
  )
}
