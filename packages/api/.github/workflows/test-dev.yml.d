name: Build and Deploy dev
on:
  push:
    branches:
      - dev

jobs:
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master

      - uses: actions/setup-node@v1
        with:
          node-version: '14'

      - name: Install Firebase Emulator Suite
        run: npm install -g firebase-tools@9.19.0

      - name: Install Dependencies
        run: npm install
    
      - name: Setup service account
        run: | 
          mkdir .local
          echo '{"type":"service_account","project_id":"english-challenge-test","private_key":"${{secrets.FIREBASE_TEST_SA_PRIVATE_KEY}}","client_email":"${{secrets.FIREBASE_TEST_SA_CLIENT_EMAIL}}","client_x509_cert_url":"${{secrets.FIREBASE_TEST_SA_CLIENT_CERT_URL}}"}' >> .local/maracuja-challenge-dev.json
          
      - name: Run all the tests
        uses: w9jds/firebase-action@master
        with: 
          args: emulators:exec --project english-challenge-test \"npm run test-wf\"
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}

      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          # GCP_SA_KEY: ${{ secrets.DEV_FIREBASE_SERVICE_ACCOUNT }}
          PROJECT_ID: english-challenge-test


      # - name: create env json
      #   uses: jsdaniell/create-json@1.1.2
      #   id: create-config-json
      #   with:
      #     name: 'env.json'
      #     json: '{"storage": {"bucket": "${{ secrets.DEV_STORAGE_BUCKET }}"}}'


      # - name: clear env configs
      #   uses: w9jds/firebase-action@master
      #   with:
      #     args: functions:config:unset env
      #   env:
      #     FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
      #     PROJECT_ID: english-challenge-test

      #   # store the env data 
      # - name: set env configs
      #   uses: w9jds/firebase-action@master
      #   with:
      #     args: functions:config:set env=\"$(cat env.json)\"
      #   env:
      #     FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
      #     PROJECT_ID: english-challenge-test

      #https://medium.com/practical-coding/set-up-gitlab-ci-cd-for-testing-your-firebase-functions-49878b3e7764
      # - name: Setup service account
      #   run: | 
      #     firebase use 


      # - name: Setup service account
      #   run: | 
      #     mkdir .local
      #     echo "${{ secrets.FIREBASE_TEST_SERVICE_ACCOUNT }}" >> .local/maracuja-challenge-dev.json

      # - name: Test
      #   run: npm run test2
      #   FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
      #   PROJECT_ID: english-challenge-test
        



