export const environment = {
  production: false,
  chatEndpoint: import.meta.env.NG_APP_CHAT_ENDPOINT || 'http://localhost:8080',
  apiUrl: import.meta.env.NG_APP_API_URL || 'https://api.honeycomb.io:443',
  honeycombApiKey: import.meta.env.NG_APP_HONEYCOMB_API_KEY || 'default-api-key'
};
