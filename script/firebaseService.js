import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7p7LubazlWBBhsAvsQinenWWxKCUtOlE",
  authDomain: "tasco-voting-app.firebaseapp.com",
  projectId: "tasco-voting-app",
  storageBucket: "tasco-voting-app.firebasestorage.app",
  messagingSenderId: "216874178884",
  appId: "1:216874178884:web:10cecd1bb5ad45e3ef1f11",
  measurementId: "G-0T45DKMP78"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export async function signIn() {
  await signInAnonymously(auth)
    .then((user) => {
      console.log("User signed in:", user.user.uid);
    })
    .catch((error) => console.error("Error during sign-in:", error));
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
  const candidates = await getCandidates();

  votesSnapshot.forEach((doc) => {    
    const candidateId = doc.data().candidateId;
    const candidate = candidates.find((c) => String(c.id) == String(candidateId));

    if (candidate) {
      candidate.totalVote = candidate.totalVote || 0;
      candidate.totalVote++;
    } 
  });

  candidates.sort((a, b) => b.totalVote - a.totalVote);
  
  return candidates;
}


const candidatesRef = collection(db, "candidates");

export async function getCandidates() {
  const querySnapshot = await getDocs(candidatesRef);
  const candidates = [];
  querySnapshot.forEach((doc) => {
    candidates.push({
      id: doc.id,
      name: doc.data().name,
      department : doc.data().department,
      position: doc.data().position,
      photo: doc.data().uri,
      totalVote: 0
    });
  });

  return candidates;
}

export async function getCandidateById(id) {
  const candidateRef = doc(db, "candidates", id);
  const candidate = await getDoc(candidateRef);
  return candidate;
}

export async function addCandidate(name, department, position, uri) {
  try {
      const docRef = await addDoc(collection(db, "candidates"), {          
          name: name,
          department: department,
          position: position,
          uri: uri
      });
      console.log("Document written with ID: ", docRef.id);
  } catch (e) {
      console.error("Error adding document: ", e);
  }
}

export async function updateCandidate(id, updatedCandidate) {  
  try {
      const candidateRef = doc(db, "candidates", id);
      await setDoc(candidateRef, {
          name: updatedCandidate.name,
          department: updatedCandidate.department,
          position: updatedCandidate.position,
          uri: updatedCandidate.photo
      }, { merge: true }); 

      console.log("Candidate updated successfully");
  } catch (error) {
      console.error("Error updating candidate: ", error);
  }
}

export async function deleteCandidateById(id) {  
  try {
      const candidateRef = doc(db, "candidates", id);     
      await deleteDoc(candidateRef);
      
      console.log("Candidate deleted successfully");
  } catch (error) {
      console.error("Error deleting candidate: ", error);
  }
}

