export const HOST = "http://192.168.50.14:3000";
const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`
export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;

export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const FETCH_ALL_USER = `${AUTH_ROUTE}/get-contacts`;
export const ADD_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/add-message`
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`