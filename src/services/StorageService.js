import { storage, auth } from "../lib/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../lib/firebase.js";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";

export class StorageService {
  static async uploadFile(file, path, onProgress) {
    return new Promise((resolve, reject) => {
      const user = auth.currentUser;
      if (!user) {
        reject(new Error('يرجى تسجيل الدخول أولاً'));
        return;
      }

      const timestamp = Date.now();
      const uniqueFileName = timestamp + '_' + file.name;
      const fullPath = 'users/' + user.uid + '/' + path + '/' + uniqueFileName;
      const storageRef = ref(storage, fullPath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload Error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
            
            const fileData = {
              name: file.name,
              originalName: file.name,
              size: file.size,
              type: file.type || 'application/octet-stream',
              url: downloadURL,
              path: fullPath,
              uploadedAt: new Date().toISOString(),
              userId: user.uid
            };
            
            const docRef = doc(collection(db, 'files'));
            await setDoc(docRef, fileData);
            
            resolve({ id: docRef.id, ...fileData });
          } catch (error) {
            console.error('Save Error:', error);
            reject(error);
          }
        }
      );
    });
  }

  static async getUserFiles() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(collection(db, 'files'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const files = [];
      querySnapshot.forEach((doc) => {
        files.push({ id: doc.id, ...doc.data() });
      });
      return files;
    } catch (error) {
      console.error('Get Files Error:', error);
      return [];
    }
  }

  static async deleteFile(fileId, filePath) {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'files', fileId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async downloadFile(fileUrl, fileName) {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static previewFile(fileUrl) {
    window.open(fileUrl, '_blank');
  }
}
