> This code was produced for Maracuja Academy between 2019 and 2023.

# Installation

## Requirements

- yarn `npm install --global yarn`
- node@16 `brew install node@16`
- python3 `phython3`
- firebase-tools `npm install -g firebase-tools`
- java `brew install java`
- cocoapods `brew install cocoapods`
- xcode

ℹ️ for ARM #pupputeer <https://linguinecode.com/post/how-to-fix-m1-mac-puppeteer-chromium-arm64-bug> `brew install chromium`

**Instal node modules**
`yarn install`

## How to import data from cloud firestore to the local emulator?

Solution from : <https://stackoverflow.com/questions/57838764/how-to-import-data-from-cloud-firestore-to-the-local-emulator>

1 - Verify you have `gsutil`, or install it <https://medium.com/@suhaib18/the-gsutil-command-aeb97079a4d8> :

- Download and install the sdk `curl https://sdk.cloud.google.com | bash`
- restart your shell `exec -l $SHELL`
-`gcloud init`
- Pick cloud project to use: select `maracuja-english-challenge` project
- `firebase login`
- `firebase use production` (maracuja-english-challenge)

2 - Créez et placez-vous dans le dossier dans `/database/`

3 - Launch simulators a first time without imported db
`firebase emulators:start --import ./data/database/default --export-on-exit` (shortcut `yarn start`)
NB : The `--export-on-exit` flag to automatically export data when you exit the emulator. (<https://firebase.google.com/docs/emulator-suite/install_and_configure>)

4- Exit the process wiith `Ctrl + C` , this will create the skeleton of the backup

3 - Download the exported backup from firestore bucket in your machine
`gsutil -m cp -r gs://maracuja-challenge-dev-backup/2021-09-27 .`

4 - Rename/replace the downloaded folder with `firestore_export`

5 - Rename the file at the root of this folder to `firestore_export.overall_export_metadata`

## How to import auth user from cloud firestore to the local emulator?

From this post <https://stackoverflow.com/questions/26801163/firebase-export-user-accounts-email-and-password-hashes/56413126>

1 - Download the accounts list from your firebase project with `firebase auth:export accounts.json --format=json`

2 - replace the existing file in the folder `auth_export'

NB : To testing email verification/sign-in with email link flows, the emulator prints a URL to the terminal at which firebase emulators:start was executed.

Now start again the emulators with the shorcut `yarn start`

## Fix hot reload

if this error happened <https://stackoverflow.com/questions/70368760/react-uncaught-referenceerror-process-is-not-defined> check not upper version of theses modules are installed

- react-error-overlay "^6.0.9"
- react-scripts@4.0.3
