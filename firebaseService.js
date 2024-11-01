import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD__TnNBBKJn4xZnMndscdTU-3R38o8OKM",
    authDomain: "test-firestore-32561.firebaseapp.com",
    projectId: "test-firestore-32561",
    storageBucket: "test-firestore-32561.firebasestorage.app",
    messagingSenderId: "189069637614",
    appId: "1:189069637614:web:0e2cae7327529f9dba00ff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export async function signIn() {
    await signInAnonymously(auth).then(user => {
        console.log("User signed in:", user.user.uid);
    }).catch(error => console.error("Error during sign-in:", error));
}

export async function voteForCandidate(candidate) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User Unauthorized.");
    }

    const userVoteRef = doc(db, "votes", user.uid);
    const userVote = await getDoc(userVoteRef);

    if (userVote.exists()) {
        throw new Error("Has already voted!");
    }

    await setDoc(userVoteRef, { candidateId: candidate });
}

export async function resetVote() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User Unauthorized.");
    }

    const userVoteRef = doc(db, "votes", user.uid);
    await deleteDoc(userVoteRef);
}

export async function getVoteResults() {
    const votesSnapshot = await getDocs(collection(db, "votes"));
    let votes = { A: 0, B: 0, C: 0 };

    votesSnapshot.forEach(doc => {
        const candidate = doc.data().candidateId;
        votes[candidate]++;
    });

    return votes;
}