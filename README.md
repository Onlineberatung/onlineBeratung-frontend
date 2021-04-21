# caritas-onlineBeratung-frontend

The frontend app for the Caritas Online Beratung.

This repository has two responsibilities:

1. Be the executable frontend app for the Caritas Online Beratung
2. Provide build tools and app code as a library, so this app can be developed and published in a themed setup

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:9000](http://localhost:9000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Runs the Cypress end-to-end tests with a mocked backend.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Library integration

When this project is used as a dependency, the consumer needs to fork these files from this repository into the consuming repository:

```
src
  pages
    app.html
    under-construction.html
  resources
    scripts
      i18n
        defaultLocale.ts
        informalLocale.ts
      config.ts
    styles
      settings.scss
  initApp.tsx
  initError.tsx
  initLogin.tsx
```

They can be used to provide the necessary configuration and theming to the consuming app.

Additionally, these scripts are available:

```sh
# Run the dev server
caritas-online-beratung-frontend start

# Build the app for production
caritas-online-beratung-frontend build
```
