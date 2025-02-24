export const HOST = "http://localhost:8000";
export const NEXT_HOST = "http://localhost:3000";

export const CONTACT_ROUTE = `/api/searchContact`;
export const SEARCH_CONTACT_ROUTE = `${NEXT_HOST}/${CONTACT_ROUTE}`;

const MESSAGE_ROUTE = `/api/message`;
export const GET_CHAT_MESSAGES = `${MESSAGE_ROUTE}/getMessages`;

const CONTACTS_ROUTE = `api/contacts`;
export const GET_CONTACT = `${CONTACTS_ROUTE}/getContacts`;

const COMMUNITY_ROUTE = `api/community`;
export const CREATE_COMMUNITY = `${COMMUNITY_ROUTE}/create`;
export const GET_COMMUNITY_INFO = `${COMMUNITY_ROUTE}/info`;
export const GET_COMMUNITY = `${COMMUNITY_ROUTE}/explore`;
export const GET_USER_COMMUNITY = `${COMMUNITY_ROUTE}/getCommunity`;
export const GET_USER_MUTUAL = `${COMMUNITY_ROUTE}/getMember`;
