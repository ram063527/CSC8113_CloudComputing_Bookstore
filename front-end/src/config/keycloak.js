import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url:      import.meta.env.VITE_KEYCLOAK_URL      || "http://localhost:9191",
  realm:    import.meta.env.VITE_KEYCLOAK_REALM    || "mylabs",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "bookstore-frontend",
});

export default keycloak;
