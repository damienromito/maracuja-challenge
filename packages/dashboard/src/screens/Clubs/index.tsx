import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Club, ClubProperty } from "@maracuja/shared/models"
import algoliasearch from "algoliasearch/lite"
import firebase from "firebase/app"
import M from "materialize-css"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import { Configure, connectHits, InstantSearch, SearchBox } from "react-instantsearch-dom"
import { Button, Modal } from "react-materialize"
import { audienceFiltersToAlgoliaFacets } from "../../utils/algolia"
import ClubItem from "./Club"
import ClubForm from "./ClubForm"

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY)

const ClubsBase = ({ popupManager }) => {
  const { currentChallenge } = useCurrentChallenge()

  const [departments, setDepartments] = useState<any>([])
  const [editedItem, setEditedItem] = useState<any>({})
  const [filters, setFilters] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState<any>(false)
  const [regions, setRegions] = useState<any>([])
  const [tribes, setTribes] = useState<any>([])
  const algoliaClubIndex = process.env.REACT_APP_ENV === "production" ? "clubs" : "dev_clubs"

  useEffect(() => {
    fetchGeo()
    fetchTribes()
  }, [])

  const fetchGeo = async () => {
    const regions = await ClubProperty.fetchValues({ id: "region" })
    setRegions(regions)

    const departments = await ClubProperty.fetchValues({ id: "department" })
    setDepartments(departments)
  }

  const fetchTribes = async () => {
    const tribes = await ClubProperty.fetchValues({ id: "tribe" })
    setTribes(tribes)
  }

  useEffect(() => {
    if (currentChallenge && !filters && currentChallenge.audience.whitelist === "none") {
      const filterArray = audienceFiltersToAlgoliaFacets(currentChallenge.audience.filters)
      setFilters(filterArray) // [["tribe.id: handball","tribeId: equitation"],["department.code: 79"]])
    }
  }, [currentChallenge])

  const onDeleteItem = (item) => {
    return item.delete()
  }

  const getIdFromClub = ({ name, zipCode, tribe }) => {
    const idString = `${getIdFromString(name)}${zipCode ? "_" + zipCode : ""}${tribe.id ? "_" + tribe.id : nanoid(4)}`
    return idString
  }

  const getIdFromString = (string) => {
    return string.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")
  }

  const onSaveItem = (values) => {
    // return
    if (editedItem && editedItem.id) {
      return Club.update({ id: editedItem.id }, values).then(() => {
        setIsModalOpen(false)
        M.toast({ html: "Club edited !" })
      })
    } else if (values.name) {
      const id = values.id || getIdFromClub(values)
      Club.create({ id }, values).then(() => {
        setIsModalOpen(false)
        M.toast({ html: "Club Créé !" })
      })
    } else {
      alert("name required")
    }
  }

  const onUploadFile = (e, item) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const name = item.id + "." + file.name.split(".").pop()
      const metadata = { contentType: file.type }
      const task = firebase
        .storage()
        .ref()
        .child("clubs/" + name)
        .put(file, metadata)
      return task.then((snapshot) => snapshot.ref.getDownloadURL())
    } else {
      return false
    }
  }

  const onClickEditItem = async (item) => {
    const club = await Club.fetch({ id: item.id })
    setEditedItem(club)
    setIsModalOpen(true)
  }

  const onCloseModal = () => {
    setEditedItem({})
    setIsModalOpen(false)
  }

  return (
    <div>
      <h1>Clubs</h1>

      <Modal
        options={{
          onOpenEnd: () => {
            setIsModalOpen(true)
          },
          onCloseEnd: onCloseModal,
        }}
        open={isModalOpen}
        header="Nouveau club"
        trigger={<Button>Nouveau Club</Button>}
      >
        {isModalOpen && (
          <ClubForm
            departments={departments}
            item={editedItem}
            onSaveItem={onSaveItem}
            regions={regions}
            tribes={tribes}
          />
        )}
      </Modal>

      <InstantSearch indexName={algoliaClubIndex} refresh searchClient={searchClient}>
        <SearchBox />
        <Configure
          // facetFilters={filters}
          hitsPerPage={30}
        />
        <CustomHits onClickEditItem={onClickEditItem} onDeleteItem={onDeleteItem} onUploadFile={onUploadFile} />
      </InstantSearch>
    </div>
  )
}

const CustomHits = connectHits(({ hits, onClickEditItem, onDeleteItem }) => {
  return hits.map((item) => {
    const c = new Club(item)
    return <ClubItem key={c.id} item={c} onClickEdit={() => onClickEditItem(c)} onDeleteItem={onDeleteItem} />
  })
})

const condition = (authUser) => !!authUser

export default ClubsBase
