import React from 'react'
import { styled, size } from '../styles'

const IconContainer = styled.div`
  
  text-align : center;
  width: 120px;
  height: 120px;
  align-self: center;
  display: inline-block;

  .imageContainer{
    display: inline-block;
    user-select: none;
    font-family : "maracuja-icons";
    color: ${props => props.theme.icon.highlighted};
    &.active {
      /* text-shadow: ${props => '-1px 0' + props.theme.bg.tertiary + ', 0 1px ' + props.theme.bg.tertiary + ', 1px 0px ' + props.theme.bg.tertiary + ', 0 -1px ' + props.theme.bg.tertiary} */
    }
  }

  .score{
    color:black;
    font-family: Montserrat, Verdana;
    font-size:100%;
    display:block;
    position:absolute;
    margin-top: 29%;
  }

  &.unavailable{
    .imageContainer{
      color: rgba(0,0,0,0.2) 
      /* #252589 */
    }
    .score{
      color: white;
    }
  } 
`

const PointIcon = ({ score = null, size = 50, isSelected, active }) => {
  return (
    <IconContainer
      className={`${(score == null || score == -1 || !isSelected) && 'unavailable'}`}
      style={{ width: size, height: size }}
    >
      <div className={`imageContainer ${active && 'active'}`} style={{ fontSize: size }}>k</div>
      <div className='score' style={{ width: size, marginTop: -size / 1.35, fontSize: size / 2.5 }}>{!!score || score === 0 ? score : '-'}</div>
    </IconContainer>
  )
}

export default PointIcon
