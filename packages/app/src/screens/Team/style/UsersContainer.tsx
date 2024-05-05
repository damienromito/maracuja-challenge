import { styled } from "../../../styles"

const UsersContainer = styled.div`
  background: ${(props) => props.theme.primary};
  min-height: calc(100% - 154px);
  .title-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    padding: 0 6px 0 8px;
  }
`

export default UsersContainer
