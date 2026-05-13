import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Account, Avatars, Client, Databases, OAuthProvider, Query } from "react-native-appwrite";

export const config = {
    platform: "danielhlas.cz/doorway",
    //variables from .env.local:
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID
}

//new version of appwrite client:
export const client = new Client()

client.setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)
//Dali jsme vykřičníky ptž si TS není jistý zda hodnoty těch proměnných existují

//Defining appwrite functionalities we use:
export const avatar = new Avatars(client); //generate avatar based on users first and last name
export const account = new Account(client); //umožňuje vytvořit nový account
export const databases = new Databases(client);

//Create new actions
//LOGIN
export async function login() {
    try {
        //Generate a redirect URI to handle OOTH response, so once we go to google, we have to go back to application letting us know that we have authenticated
        //we use expo module Expo-linking for handlign deep links and redirect URL
        const redirectUrl = Linking.createURL("")
        console.log("Redirect URL:", redirectUrl)

        //request OOTH token from appwrite using Google provider:
        const response = await account.createOAuth2Token(
            OAuthProvider.Google,  //1.par = provider
            redirectUrl //2.par - we pass redirect uri
        )

        if (!response) throw new Error("Failed to login")

        //open web browser session with oath process to continue:
        const browserResult = await openAuthSessionAsync(
            response.toString(), //= response from Google
            redirectUrl
        )

        if (browserResult.type !== "success") throw new Error("failed to login")

        //everything went right, we can parse returned url to extract query parameters:
        const url = new URL(browserResult.url)

        //we can extract the secret and user ID:
        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();

        if (!secret || !userId) throw new Error("Failed to login")

        //create session:
        const session = await account.createSession(userId, secret)

        if (!session) throw new Error("failed to crate a session")

        return true; //means login successfull
    }
    catch (e) {
        console.error(e)
        return false;
    }

}


//LOGOUT
export async function logout() {
    try {
        //delete current session:
        await account.deleteSession("current")
        return true;
    }
    catch (e) {
        console.error(e)
        return false;
    }
}

//FETCH info about current user:
export async function getCurrentUser() {
    try {
        const response = await account.get();

        if (response.$id) {
            //generate image with user initials, což appwrite dělá jednouše:
            const userAvatar = avatar.getInitialsURL(response.name)
            //response.name dostaneme z Google

            //destructure response
            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }
    }
    catch (error: any) {
        //fix for non-logged users trying to fetch user info
        const isGuest = error?.message?.includes("missing scopes");
        if (!isGuest) {
            console.error(error);
        }
        return null;
    }
}

//FETCH DATA FROM APPWRITE DB:
export async function getLatestProperties() {
    try {
        const result = await databases.listDocuments(
            config.databaseId!,
            config.propertiesCollectionId!,
            //query:
            [Query.orderAsc("$createdAt"), Query.limit(5)]
        )
        return result.documents;
    }
    catch (error) {
        console.log(error)
        return []
    }
}

export async function getProperties({ filter, query, limit }: { filter: string, query: string, limit?: number }) {
    try {
        const buildQuery = [Query.orderDesc("$createdAt")];

        //append additional things to query:
        if (filter && filter !== "All") {
            //we will only reutrn properties where query = filter
            buildQuery.push(Query.equal("type", filter))
        }

        if (query) {
            buildQuery.push(
                Query.or([
                    //search query by name
                    Query.search("name", query),
                    //or address
                    Query.search("address", query),
                    //or type(house, condo...
                    Query.search("type", query)
                ])

            )
        }

        if (limit) buildQuery.push(Query.limit(limit)) //limit it to number of properties

        const result = await databases.listDocuments(
            config.databaseId!,
            config.propertiesCollectionId!,
            buildQuery
        )
        return result.documents;
    }
    catch (error) {
        console.log(error)
        return []
    }
}


//FETCH detailed info about specific property:
export async function getPropertyById({ id }: { id: string }) {
    try {
        const result = await databases.getDocument(
            config.databaseId!,
            config.propertiesCollectionId!,
            id
        )

        //get data about agent (from table agents)
        if (typeof result.agent === "string") {
            result.agent = await databases.getDocument(
                config.databaseId!,
                config.agentsCollectionId!,
                result.agent
            );
        }

        // get reviews (from table reviews)
        // reviews – načti podle property ID
        const reviews = await databases.listDocuments(
            config.databaseId!,
            config.reviewsCollectionId!,
            [Query.equal("property", id)]  // název sloupce v tabulce reviews
        );
        result.reviews = reviews.documents;

        return result;
    }
    catch (error) {
        console.log(error)
        return null
    }
}