import {Client} from "appwrite"

const databaseID="649a7773b3b36ec6e16c"
const rooms="649dbf16dff8405bdf74"
const queue="649a778c984e3e3b5e97"
const client= new Client()
.setEndpoint('https://cloud.appwrite.io/v1') // We set the endpoint, change this if your using another endpoint URL.
.setProject('649a774a5cd483375fb1') // Here replace 'ProjectID' with the project ID that you created in your appwrite installation.

export { client,databaseID,rooms, queue }; // Finally export the client to be used in projects.