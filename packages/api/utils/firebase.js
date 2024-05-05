const fetchRef = (ref, { initializer, defaultValue } = {}) => {
  const parseObjectSnap = (snap) => {
    let object = parseSnap(snap) || defaultValue
    if (initializer && object) {
      return initializer(object)
    } else {
      return object
    }
  }

  return ref.get().then((snap) => {
    return parseObjectSnap(snap)
  })
}

const fetchListRef = (ref) => {
  return ref.get().then((snap) => {
    return parseSnapCollection(snap)
  })
}

const parseSnap = (snap) => {
  if (snap.exists) {
    return objectFromSnap(snap)
  } else {
    return false
  }
}

const parseSnapCollection = (snap) => {
  if (snap.size) {
    return snap.docs.map((snap) => {
      return objectFromSnap(snap)
    })
  } else {
    return false
  }
}

const objectFromSnap = (snap) => {
  return {
    id: snap.id,
    ...snap.data(),
  }
}

module.exports = {
  fetchListRef,
  fetchRef,
}
