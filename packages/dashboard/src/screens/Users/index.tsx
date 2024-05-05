import M from "materialize-css"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Button, Modal } from "react-materialize"
import { atTimeFields } from "@maracuja/shared/api/helpers"

import ItemForm from "./UserForm"
import Item from "./User"
import firebase from "firebase/app"
import "firebase/firestore"
const itemSchema = {
  previewField: "firstName",
  fields: {
    firstName: {
      default: "",
      label: "Prénom",
      preview: true,
    },
    phone: {
      default: "",
      label: "Téléphone",
    },
    email: {
      default: "",
      label: "Email",
    },
  },
}

const ItemsBase = () => {
  const [loading, setLoading] = useState<any>(false)
  const [items, setItems] = useState<any>([])
  const [limit] = useState<any>(10)
  const [isModalOpen, setIsModalOpen] = useState<any>(false)

  let itemList = null

  const onCreateItem = (values) => {
    return firebase
      .firestore()
      .collection("users")
      .doc()
      .set({
        ...values,
        ...atTimeFields(true),
      })
      .then(() => {
        setIsModalOpen(false)
      })
  }

  useEffect(() => {
    M.Collapsible.init(itemList, {})
    const itemsListener = firebase
      .firestore()
      .collection("users")
      // .orderBy("editedAt")
      .limit(limit)
      .onSnapshot((snapshot) => {
        setLoading(false)
        if (snapshot.size) {
          const items = []
          snapshot.forEach((doc) => items.push({ ...doc.data(), id: doc.id }))
          setItems(items.reverse())
        } else {
          setItems(null)
        }
      })

    return () => {
      itemsListener()
    }
  }, [])

  return (
    <div>
      <h1>Utilisateurs</h1>

      <Modal
        options={{
          onOpenEnd: () => {
            setIsModalOpen(true)
          },
        }}
        open={isModalOpen}
        header="Nouvel Utilisateur"
        trigger={<Button>Nouvel utilisateur</Button>}
      >
        <ItemForm onSaveItem={onCreateItem} schema={itemSchema} />
      </Modal>

      {loading && <div>Loading... </div>}
      {items ? (
        <ul
          className="collapsible"
          ref={(o) => {
            itemList = o
          }}
        >
          {items.map((item) => (
            <Item key={item.id} />
          ))}
        </ul>
      ) : (
        <div>Il n'y a aucun utilisateur ...</div>
      )}
    </div>
  )
}

export default ItemsBase
