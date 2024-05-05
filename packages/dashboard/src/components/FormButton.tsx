import styled from "styled-components"

interface FormButtonProps {
  red?: true
}

export default styled.button<FormButtonProps>`
  background-color: ${(props) => (props.disabled ? "#B7B6B6" : props.red ? "#CF2A2A" : "#525252")};
  border-radius: 5px;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px 33px;
`
