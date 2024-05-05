import { ClubProperty } from "@maracuja/shared/models"
import M from "materialize-css"
import { useEffect, useState } from "react"
import { Button, Modal } from "react-materialize"
import Item from "./Tribe"
import TribeForm from "./TribeForm"

const TribesBase = ({ popupManager }) => {
  const [property, setProperty] = useState<any>()

  const [isModalOpen, setIsModalOpen] = useState<any>(false)
  const [editedItem, setEditedItem] = useState<any>(null)

  const onDeleteItem = (id) => {
    return property.deleteValue(id)
  }

  useEffect(() => {
    const unsubscribe = ClubProperty.fetch(
      { id: "tribe" },
      {
        listener: (property) => {
          setProperty(property)
        },
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const onSaveItem = async ({ name, id }) => {
    await property.addValue({ name, id })
    M.toast({ html: "Tribe edited !" })
    // return
    // if (values.id) {
    //   return api.tribe(values.id).set({
    //     ...values,
    //     ...atTimeFields()
    //   }, { merge: true })
    //     .then(() => {
    //       setIsModalOpen(false)
    //       M.toast({ html: 'Tribe edited !' })
    //     })
    // } else {
    //   const index = generateId(values.name)

    //   return api.tribes().doc(index).set({
    //     ...values,
    //     ...atTimeFields(true)
    //   }).then(() => {
    //     setIsModalOpen(false)
    //     M.toast({ html: 'Tribe Créé !' })
    //   })
    // }
  }

  // const onClickEditItem = (item) => {
  //   setIsModalOpen(true)
  //   api.tribe(item.id).get()
  //     .then(snap => {
  //       const tribe = objectFromSnap(snap)
  //       setEditedItem(tribe)
  //     })
  // }

  const onCloseModal = () => {
    setEditedItem(null)
    setIsModalOpen(false)
  }

  return (
    <div>
      <h1>Type de tribu</h1>

      <Modal
        options={{
          onOpenEnd: () => {
            setIsModalOpen(true)
          },
          onCloseEnd: onCloseModal,
        }}
        open={isModalOpen}
        header="Nouvelle tribu"
        trigger={<Button>Nouvelle tribu</Button>}
      >
        <TribeForm onSaveItem={onSaveItem} item={editedItem} />
      </Modal>

      <ul className="collection">
        {property?.values?.map((item) => {
          return <Item key={item.id} item={item} onDeleteItem={onDeleteItem} />
        })}
      </ul>
    </div>
  )
}

export default TribesBase
