
import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  body {
    font-family: 'Open Sans', arial;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 15px;
    height : 100%;
  }
  .react-datepicker-popper{
    z-index: 9;
  }
  .error-label{
    margin-top: -25px;
  }
  p{
    margin : 5px 0;
  }
  /* label {
    color : black; 
    height: auto;
    display: block;
    transform: none;
    transform-origin: unset;
    }; */

    h1{
    font-size: 38px;
  }
  h2{
    font-size: 22px;
  }
  h3{
    font-size: 18px;
  }
  h4{
    font-size: 14px;
  }

`
