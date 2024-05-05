import { uploadImage } from '@maracuja/shared/api/helpers'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { EditPage } from '../../../components'
import { ROUTES } from '../../../constants'
import { useApp, useCurrentChallenge } from '../../../contexts'
import useSuggestion from '../../../hooks/useSuggestion'
import EditPlayerAvatar from './EditPlayerAvatar'
import EditPlayerName from './EditPlayerName'

const EditCurrentPlayer = () => {
  const { currentChallenge, currentPlayer } = useCurrentChallenge()
  const { setLoading, logEvent } = useApp()
  const { hideSuggestion } = useSuggestion()
  const history = useHistory()

  const [imageData, setImageData] = useState(null)
  const [isDone, setIsDone] = useState(false)
  const [pagesRoutes, setPagesRoutes] = useState([])

  useEffect(() => {
    dynamicPagesRoutes()
  }, [currentChallenge, currentPlayer, imageData])

  const dynamicPagesRoutes = () => {
    const pages = [{
      component: <EditPlayerName />,
      params: 'name',
      title: 'Nom',
      icon: 'id',
      saveButton: 'true'
    }, {
      component: <EditPlayerAvatar
        avatar={currentPlayer.avatar}
        localImageData={imageData}
        setLocalImageData={setImageData}
        isDone={isDone}
        setIsDone={setIsDone}
                 />,
      params: 'photo',
      title: 'Photo',
      icon: 'profile',
      saveButton: 'false'
    }]

    setPagesRoutes(pages)
  }

  const handleSubmitForm = async (values, e) => {
    setLoading(true)
    if (imageData) {
      const originalImageUrl = await uploadImage({
        imageData,
        challengeId: currentChallenge.id,
        fileName: 'avatar',
        folderPath: `users/${currentPlayer.id}`,
        transformationEnabled: currentChallenge.playersAvatarWithoutBackground
      })

      const params = {
        imageUrl: originalImageUrl,
        oldAvatarReplaced: !!currentPlayer.avatar?.original,
        removeBackground: currentChallenge.playersAvatarWithoutBackground
        // test: true
      }
      try {
        await currentPlayer.updateAvatar(params)
        logEvent('avatar_sending_end')
      } catch (error) {
        alert('Une erreure est survenue, merci de reessayez ou contacter nous à admin@maracuja.ac.')
      }
      hideSuggestion('playerCard')
      setIsDone(true)
    } else {
      logEvent('username_changed')
    }

    const data = { ...values }
    delete data.image
    delete data.redirectHome
    await currentPlayer.update(data)

    e.setSubmitting(false)
    e.resetForm({ values: data })
    setLoading(false)
    if (values.redirectHome) { history.push(ROUTES.ACTIVE_CLUB) }
  }

  return (
    <>
      <EditPage
        formValues={{
          image: currentPlayer.avatar || '',
          username: currentPlayer.username || '',
          redirectHome: false
        }}
        onSubmitForm={handleSubmitForm}
        pagesRoute={pagesRoutes}
        titleForm='Édition profil'
      />
    </>
  )
}

export default EditCurrentPlayer
