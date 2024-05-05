import './maracuja-icons/styles.css'
import '@ionic/react/css/core.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/padding.css'
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';

import { createGlobalStyle } from 'styled-components'
// import IonicStyles from './ionic-styles'

import { size } from './'

export default createGlobalStyle`



/* * {
      touch-action: manipulation;
  } */

html {
  box-sizing: border-box;
  height : 100%;
  background: ${props => props.bg.primary};
  background-attachment : fixed ;
  background-repeat: no-repeat;
  margin:0;
  user-select:none
}

:root {
  --ion-font-family: 'Open Sans', arial;
  /* --ion-safe-area-top : 20px;
  --ion-safe-area-bottom : 16px; */
  --ion-text-color : ${props => props.text.primary};
}
  ion-toast {
    --background: white;
    --color : black
  }
  ion-content {
    --ion-background-color: ${props => props.bg.primary};
    --ion-text-color: ${props => props.text.primary};
  }

  ion-modal {
    --background: none!important;
    --backdrop-opacity: 0.55!important;
    --height: 100vh!important;
    --width: 100vw!important;
  }

  ion-tab-bar {
    --background : ${props => props.theme.bg.secondary};
  }

  ion-picker{
    --max-width : inherit!important;
    --ion-item-color : #3880ff;
  }

  ion-tab-button {
    --color: ${props => props.theme.text.tertiary};
    --color-selected : white;
    --color-focused : white;
    font-family: Montserrat, Verdana;
    font-size:12px;
    font-weight:400;
  }

  /* ion-header ion-toolbar:first-child {
    padding-top: var(--ion-safe-area-top, 30);
  } */
  .header-md::after{
    background-image : none
  }

  ion-datetime {
    --ion-item-color : red;
    color:red;
    color : black!important;
    --padding-top : 10px;
    width : 100%;
    box-sizing: border-box;
    background : white;
    padding : 28px 30px 0;
    border : none;
    height : 75px;
    border-radius : ${size.borderRadius};
    &.datetime-placeholder{
      color : ${props => props.theme.text.disabled}!important;
    }
  }

  ion-alert{
    --ion-text-color: black;
  }



body {
  font-family: 'Open Sans', arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 17px;
  color :  white;
  height : 100%;
}
#root{
  height : 100%;
}
h1, h2, h3, h4 {
  margin : 0;
  font-weight: 600;
  font-family: Montserrat, Verdana ;
}

button {
  background : transparent;
  border : none;
  color:white;
  cursor:pointer;
  &:focus {outline:0;}
}

input, .input, textarea {
  color:black!important;
  outline: none;
  width : 100%;
  box-sizing: border-box;
  background : white;
  padding : 0px 30px 0;
  border : none;

  border-radius : ${size.borderRadius};
  ::placeholder{
    color : ${props => props.theme.text.disabled}
  }
  p{
    color : ${props => props.theme.text.disabled};
    cursor : pointer;
    padding: 26px 0;
  }
  &.lightBg{
    background : ${props => props.theme.bg.game}
  }
}

input, .input{
  height : 75px;
}

input[type='checkbox'] {
  display:inline;
  margin-right:6px;
  width: 21px;
  height: 17px;
}

textarea{
  min-height: 116px;
  padding: 15px;
}
p{
  margin : 3px 0;
}
a{
  color : white;
  text-decoration : none;
  cursor: pointer;
}
ul
{
list-style: none;
padding: 0;
margin: 0;
}

li {
  margin:0;
  padding: 0;
  text-indent: 0;
  list-style-type: 0;
  list-style-type: none;
}

button {
  padding : 0
}

 *,
 *::before,
 *::after {
   //box-sizing: inherit;
}
[class^="icon-"]:before, [class*=" icon-"]:before {margin-left:0}
.fixed {
  position : fixed;
}

.center {
  text-align : center;
}


.max-width-container {
  max-width : 750px;
  margin-left: auto;
  margin-right: auto;
}

`
