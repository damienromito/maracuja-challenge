import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import ViewPlayerCard from './screens/PlayerCard'
import GlobalStyles from './styles/global-styles'
// import GlobalStyles from '@maracuja/app/src/styles/global-styles'

import { defaultTheme } from './styles/themes'
ReactDOM.render(
  <ThemeProvider theme={defaultTheme}>
    <GlobalStyles {...defaultTheme} />
    <Router>
      <Route component={ViewPlayerCard} />
    </Router>
  </ThemeProvider>
,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       // console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       // console.log('SW registration failed: ', registrationError);
//     });
//   });
// }
