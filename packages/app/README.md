Production Website: https://challenges.maracuja.ac

# Installation

From the project directory, you can run:

## 1 - install dependencies
```
yarn install
```

## 2 - paste environment variables
Get and paste de .env file at the root of the directory

## 3 - Runs the app in the development mode.
```
yarn start
```

## 4 - Configurer l'app souhaitée
Les differentes apps sont listé dans apps.config.js
`yarn configure testchallenge` (Pour le projet firebase de dev)
`yarn configure challenge`  (Pour l'app Maracuja)
`yarn configure crosna`  (Pour l'app du cros)
`yarn configure crosna all`  (Pour build l'app)

### Then, to test on mobile, launch app with capacitor
#### on Android
`yarn cap-android`
#### on Android
`yarn cap-ios`

# Deployment

## 1 - Build the project 
#### For Web
`yarn build`
#### For mobile and web
`yarn build-apps`

## 3 - Deploy on the right environment
```
yarn run deploy
```
## 3 - Deploy with appflow
https://ionic.io/docs/appflow/deploy/cli
```
yarn run deploy-app
```

# Security Rules
For each new collection, you need to define rules 
Doc : https://firebase.google.com/docs/firestore/security/rules-structure

Tutorial to understand : https://www.youtube.com/watch?v=b7PUm7LmAOw

## 2 - Deploy firebase rules
```
yarn run deploy-rules
```

or rules will be deployed when `yarn run deploy`

# Generate resources
```
yarn resources
```
scripts from https://gist.github.com/dalezak/a6b1de39091f4ace220695d72717ac71

# Fonts
'englishChallenge' font is build with http://app.fontastic.me/

# Common problems
Be carefull to change module version in all packages.json shared + dashboard + app if shared
