import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080/', // your Keycloak URL
    realm: 'hope-health-realm',
    clientId: 'hope-health-client',
});

export default keycloak;