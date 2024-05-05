import { size } from "./"
export default `
  ion-content{
    --ion-background-color: ${(props) => props.primary};
    --ion-text-color: ${(props) => props.text.primary};
    
  }

  ion-tab-bar {
    --background : ${(props) => props.theme.bg.secondary};
  }

  ion-picker{
    --max-width : inherit!important;
    --ion-item-color : #3880ff;
  }

  ion-tab-button {
    --color: ${(props) => props.theme.text.tertiary};
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
      color : ${(props) => props.theme.text.disabled}!important;
    }
  }

  ion-alert{
    --ion-text-color: black;
  }
`
