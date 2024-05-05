import { styled, size } from '../styles'
import FullScreenContainer from './FullScreenContainer'

const RadialContainer = styled(FullScreenContainer)`

  &:before{
    content: " ";
    position : fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index : -1;
    background: rgba(255,255,255,0.07);
    mask: repeating-conic-gradient(#000 0% 2.5%, transparent 0% 5%);
  }
`

export default RadialContainer
