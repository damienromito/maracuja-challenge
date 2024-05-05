import { nanoid } from "nanoid"

const objectFromSnap = (snap) => {
  return {
    id: snap.id,
    ...snap.data(),
  }
}

const generateId = (string) => {
  return (
    string
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .normalize("NFD") +
    "_" +
    nanoid(1)
  )
}

const objectSubsetWithPlaceholder = (input, placeholders) => {
  const keys = Object.keys(placeholders)
  const result = keys.reduce((acc, key) => {
    const placeholder = placeholders[key]
    if (!input && placeholder != null) acc[key] = placeholder
    else if (input[key] || placeholder != null) {
      acc[key] = input[key] || placeholder
    }
    return acc
  }, {})
  return result
}

export { objectSubsetWithPlaceholder, generateId, objectFromSnap }
