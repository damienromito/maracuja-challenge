import styled from "styled-components"

interface NavRouteProps {
  selected: boolean
}
const NavRoute = styled.li<NavRouteProps>`
  i {
    color: ${(props) => (props.selected ? props.theme.icon.primary : props.theme.icon.disabled)};
  }
`
export default NavRoute
