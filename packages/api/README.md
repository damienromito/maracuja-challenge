Production Website: https://challenges.maracuja.ac

Organisation inspiration : https://codeburst.io/organizing-your-firebase-cloud-functions-67dc17b3b0da

-------------------

## Choose your environment

Listed in `.firebaserc`

**Development**
`firebase use staging`
(shortcut `npm run use-dev`)

**Production**
`firebase use production`
(shortcut `npm run use-prod`)
/!\ Staging environment is the _online_ test database, to have local database you need to generate it with the `/tests` folder

---

## Authentification to the firebase project

### Get the auth json file

Get the config file to access to your db prod (maracuja-english-challenge) or test (english-challenge-test )

1. In the Firebase console, open Settings > Service Accounts.
2. Click Generate New Private Key, then confirm by clicking Generate Key.
3. Securely store the JSON file containing the key.

(from Tutorial : https://firebase.google.com/docs/admin/setup#initialize-sdk)

### export the json file in your terminal

In the terminal : `export GOOGLE_APPLICATION_CREDENTIALS=[PATH OF YOU JSON FILE]`

> You probably have two files :
>
> - one for the production db (maracuja-english-challenge = `npm run use-dev`)
> - one for test db (english-challenge-test = `npm run use-prod`)

Example for Damien computer : `export GOOGLE_APPLICATION_CREDENTIALS="/Users/damienromito/ssl/english-challenge-test.json"`

Check with `printenv | grep GOOGLE`

> If you close your terminal, you'll need to do this again
> Below a tips to simplify it :

1. create alias in .bashrc like `alias export-dev='export GOOGLE_APPLICATION_CREDENTIALS="/Users/damienromito/ssl/maracuja-challenge-dev"'`
2. when you open your terminal you just have to call `export-dev`(you can do the same for `export-prod`)

---

## Start functions emulators

`firebase emulators:start`
(shortcut `yarn start`)

You can see logs of the online functions on https://console.firebase.google.com/project/english-challenge-test/functions/list or `firebase functions:list` 

---

---

# Develop the API

## Create endpoint

The API has a "file base structure" (generated in the index.js) :
If your cloud function is located at the path `api/players/create.f.js` the endpoint will be `{apiBaseUrl}/apiPlayersCreate`

Note : add/remove `.f` at the end of the name of your file to be recognized/remove as cloud functions (exemple : `create.js` => `create.f.js`)

---

## Test endpoint with Postman

1. Download the postman App (https://www.postman.com/)
2. Connect you to the maracuja account (`damienromito` identifiants on 1password)
3. Select your environment (LocalDev, LocalProd, Dev, Prod)
4. You can test/create endpoints


---

## Test functions in local from the react app

ℹ️ All API endpoints are listed in the Postman project

Launch the app with `yarn start:dev`
It will lunch firestore and functions emulators

│ Functions │ localhost:5001 │ http://localhost:4000/functions │
├───────────┼────────────────┼─────────────────────────────────┤
│ Firestore │ localhost:8080 │ http://localhost:4000/firestore │

example : to call the endpoint apiReferralCodeCheck, call the url `http://localhost:5001/english-challenge-test/europe-west1/apiReferralCodeCheck`

We use postman to test endpoints :

Import the collection of endpoint from the file `MaracujaChallenge.postman_collection.json`

## Deploy your function(s)

**deploy on the right environment :**
`firebase deploy --only functions` (shortcut `yarn deploy-dev` )

**deploy just one function :**

`firebase deploy --only functions:$f` (shortcut `yarn deploy-f` )
Example : `f=apiPlayersCreate yarn deploy-f`


---

# Rules & Best Practices

Date format have to be ISO 8601

```
const date = new Date
const isoDate = date.toISOString() // sent this format to the API

const date = new Date(isoDate)// send this format to firestore database
```

---

# BACKUP Firestore Database

## One time backup

https://console.cloud.google.com/firestore/export?project=maracuja-english-challenge

## Daily backup configured in the deploy-{env}.yml file

in the file `scheduler/backup.f.js`


## How to import collection from an other projet

Verify to have permission to access to the bucket from the other
https://cloud.google.com/storage/docs/access-control/using-iam-permissions#bucket-add

Import the data from the saved backup :
`gcloud firestore import gs://maracuja-challenge-backup/2022-08-08/ --async`

---

# Add new env variable

https://firebase.google.com/docs/functions/config-env

List env variables :

```
firebase functions:config:get
```

Set variable example :

```
firebase functions:config:set algolia.clubs_key="dev_clubs"
```

```
functions.config().algolia.clubs_key
```
