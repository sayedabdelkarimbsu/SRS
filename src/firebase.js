import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, GithubAuthProvider,
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA6N6b2-4Vt_T2kb8MZEtNHOACpJj9Osxs',
  authDomain: 'srs-system-6b045.firebaseapp.com',
  projectId: 'srs-system-6b045',
  storageBucket: 'srs-system-6b045.firebasestorage.app',
  messagingSenderId: '799691975244',
  appId: '1:799691975244:web:1183d71175b545a12862e9',
  measurementId: 'G-G8SCGC54LS'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName, email: user.email, photoURL: user.photoURL,
      provider: 'google', lastLogin: new Date().toISOString()
    }, { merge: true });
    return { success: true, user };
  } catch (error) { return { success: false, error: error.message }; }
};

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName, email: user.email, photoURL: user.photoURL,
      provider: 'github', lastLogin: new Date().toISOString()
    }, { merge: true });
    return { success: true, user };
  } catch (error) { return { success: false, error: error.message }; }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) { return { success: false, error: error.message }; }
};

export const signUpWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await sendEmailVerification(user);
    await setDoc(doc(db, 'users', user.uid), {
      name: name || email, email: user.email, provider: 'email',
      createdAt: new Date().toISOString()
    });
    return { success: true, user };
  } catch (error) { return { success: false, error: error.message }; }
};

export const logout = async () => {
  try { await signOut(auth); return { success: true }; } 
  catch (error) { return { success: false, error: error.message }; }
};

export const onAuthStateChange = (callback) => onAuthStateChanged(auth, callback);

export const resetPassword = async (email) => {
  try { await sendPasswordResetEmail(auth, email); return { success: true }; } 
  catch (error) { return { success: false, error: error.message }; }
};

export const saveProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'profiles', userId), {
      ...profileData, updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem('profile_' + userId, JSON.stringify(profileData));
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const getProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'profiles', userId));
    if (docSnap.exists()) return { success: true, data: docSnap.data() };
    const localData = localStorage.getItem('profile_' + userId);
    if (localData) return { success: true, data: JSON.parse(localData) };
    return { success: true, data: {} };
  } catch (error) { return { success: false, error: error.message }; }
};

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error) { return { success: false, error: error.message }; }
};

export const deleteFile = async (path) => {
  try { await deleteObject(ref(storage, path)); return { success: true }; } 
  catch (error) { return { success: false, error: error.message }; }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    querySnapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
    return { success: true, data: users };
  } catch (error) { return { success: false, error: error.message }; }
};

export { auth, db, storage };
