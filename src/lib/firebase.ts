import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection as per guidelines
async function testConnection() {
  try {
    // Attempting to read a non-existent doc to check connectivity
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase connection established.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("client is offline")) {
      console.error("Please check your Firebase configuration or network.");
    } else {
      console.log("Firebase connection verified (doc might not exist, but no network error).");
    }
  }
}

testConnection();
