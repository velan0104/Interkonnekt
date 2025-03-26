export const HOST = "http://localhost:8000";
export const NEXT_HOST = "http://localhost:3000";

export const CONTACT_ROUTE = `/api/searchContact`;
export const SEARCH_CONTACT_ROUTE = `${NEXT_HOST}/${CONTACT_ROUTE}`;

const MESSAGE_ROUTE = `/api/message`;
export const GET_CHAT_MESSAGES = `${MESSAGE_ROUTE}/getMessages`;

const CONTACTS_ROUTE = `api/contacts`;
export const GET_CONTACT = `${CONTACTS_ROUTE}/getContacts`;

export const COMMUNITY_ROUTE = `api/community`;
export const CREATE_COMMUNITY = `${COMMUNITY_ROUTE}/create`;
export const GET_COMMUNITY_INFO = `${COMMUNITY_ROUTE}/info`;
export const GET_COMMUNITY = `${COMMUNITY_ROUTE}/explore`;
export const GET_USER_COMMUNITY = `${COMMUNITY_ROUTE}/getCommunity`;
export const GET_USER_MUTUAL = `${COMMUNITY_ROUTE}/getMember`;
export const ADD_COMMUNITY_MEMBER = `${COMMUNITY_ROUTE}/add-member`;
export const CREATE_POST = `${COMMUNITY_ROUTE}/createPost`;
export const GET_COMMUNITY_POSTS = `${COMMUNITY_ROUTE}/getCommunityPosts`;
export const GET_ALL_COMMUNITY_POSTS = `${COMMUNITY_ROUTE}/getAllPosts`;
export const LIKE_COMMUNITY_POST = `${COMMUNITY_ROUTE}/likePost`;
export const ADD_COMMUNITY_POST_COMMENT = `${COMMUNITY_ROUTE}/addComment`;
export const GET_POST_WITH_COMMENTS = `${COMMUNITY_ROUTE}/getPostWithComments`;

const WORKSHOP_ROUTE = `/api/workshop`;

export const CREATE_WORKSHOP = `${WORKSHOP_ROUTE}/createWorkshop`;
export const UPDATE_WORKSHOP_POST = `${WORKSHOP_ROUTE}/upateWorkshopPost`;
export const ON_WORKSHOP_COMPLETION = `${WORKSHOP_ROUTE}/workshopCompletion`;
export const GET_WORKSHOP_BY_ID = `${WORKSHOP_ROUTE}/getWorkshopPost`;
export const GET_WORKSHOP_FOR_COMMUNITY = `${WORKSHOP_ROUTE}/community`;
export const START_WORKSHOP = `${WORKSHOP_ROUTE}/start`;
export const GET_MEETINGLINK = `${WORKSHOP_ROUTE}/meetingLink`;
export const ADD_PARTICIPANT_WORKSHOP = `${WORKSHOP_ROUTE}/addParticipant`;
