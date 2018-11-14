// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  clientDomain: 'localhost:4200',
  authApiUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000',
  // because function calls in decorators can't be used with --aot, we must
  // manually specify domains here instead of passing authApiUrl to function
  authApiDomain: 'localhost:3000',
  apiDomain: 'localhost:3000',
}
