export const HOST = "http://localhost:3000";
const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const FETCH_ALL_USER = `${AUTH_ROUTE}/get-contacts`;
export const GET_GENERATE_TOKEN =  `${AUTH_ROUTE}/generate-token/`;



export const ADD_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/add-message`
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`
export const SEND_IMAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-msg`;
export const SEND_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-msg`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`;

