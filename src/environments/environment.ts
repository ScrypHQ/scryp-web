// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  OAUTH_IDP_DOMAIN: 'scryp-web.auth.us-east-1.amazoncognito.com',
  OAUTH_IDP_APP_CLIENT_ID: '17lq3g3ff2lqkd1fsfn9u062uu',
  APP_LOGIN: 'http://localhost:4200',
  APP_LOGOUT: 'http://localhost:4200/logout',
  PARTNERS_URL: 'https://budb56gsbj.execute-api.us-east-1.amazonaws.com/Prod',
  OFFERS_URL: 'https://yo8mpueb47.execute-api.us-east-1.amazonaws.com/Prod'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
