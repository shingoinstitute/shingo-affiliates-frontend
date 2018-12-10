export const environment = {
  production: true,
  clientDomain: 'affiliates.shingo.org',
  // should be valid url WITHOUT trailing slash
  authApiUrl: 'https://api.shingo.org/v2/affiliates',
  apiUrl: 'https://api.shingo.org/v2/affiliates',
  // because function calls in decorators can't be used with --aot, we must
  // manually specify domains here instead of passing authApiUrl to function
  authApiDomain: 'api.shingo.org',
  apiDomain: 'api.shingo.org',
}
