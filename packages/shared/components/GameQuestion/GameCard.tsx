import React, { useEffect } from 'react'
import YouTube from 'react-youtube'
import Title2 from '../Title2'
import styled from 'styled-components'
import GameCopyright from './GameCopyright'
import GameImageContainer from './GameImageContainer'

const ReactMarkdown = require('react-markdown')

const GameCard = ({ question, handleCanAnswer, scrollToTop, setIsCorrect }) => {
  useEffect(() => {
    checkAnswer()
  }, [question])

  const checkAnswer = () => {
    handleCanAnswer(true)
    setIsCorrect(true)
    scrollToTop()
  }

  return (

    <Container>
      <Title2>{question.text}</Title2>
      {question.image && !question.mediaIsVideo &&
        <GameImageContainer image={question.image} />}
      {question.video && question.mediaIsVideo &&
        <VideoPlayer url={question.video} />}
      {question.content &&
        <Content source={question.content} escapeHtml />}
      {question.copyright &&
        <GameCopyright text={question.copyright} />}
    </Container>
  )
}

export default GameCard

const Container = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  `

const Content = styled(ReactMarkdown)`
  text-align : left;
  line-height: 22px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  align-self:center;
  ul{ padding-left: 20px;}
  li{list-style-type: disc!important }
  blockquote {
    border-color : ${props => props.theme.text.tertiary}
  }
  p { margin:  15px 0}
`

const VideoContainer = styled.div`
  margin: 15px 0;
  iframe{
    max-height: 50vh;
    background : grey;
    max-width: 100%;
    border: 0;
  }
`
const VideoPlayer = ({ url }) => {
  return (
    <VideoContainer>
      {url.includes('videas.fr/')
        ? <iframe
            width='560' height='315' src={url}
            frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        : <YouTube
            videoId={url}
            opts={{
              height: '390',
              width: '640',
              playerVars: {
                autoplay: 1,
                rel: 0,
                showinfo: 0,
                modestbranding: 1
              } // https://developers.google.com/youtube/player_parameters
            }}
          />}

    </VideoContainer>
  )
}
