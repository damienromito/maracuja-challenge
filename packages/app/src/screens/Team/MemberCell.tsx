import { Button, Icon, Title3 } from '@maracuja/shared/components'
import React from 'react'
import { UserIcon } from '../../components'
import { styled } from '../../styles'

export default ({ member, onClickOpenRecruitMember }) => {
  return (
    <>
      <MemberContainer>
        <MemberIcon name='shirt' />
        <MemberName>{member.firstName ? member.firstName + ' ' + (member.lastName || '') : member.username || 'Joueur mystère'}</MemberName>
        <Button style={{ width: '65px' }} onClick={() => onClickOpenRecruitMember({ member })}><Icon name='shirtPlus' color='white' /></Button>
      </MemberContainer>
    </>
  )
}

const MemberContainer = styled.div`
  display: flex;
  height:100%;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15px;
  text-align : left;
`

const MemberIcon = styled(UserIcon)`
  svg{opacity : 0.4; color : black}
`

const MemberName = styled(Title3)`
  width: 100%;
  text-align: left;
  color:${props => props.theme.text.tertiary};
  flex: 1;
`
