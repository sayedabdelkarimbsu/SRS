import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { storage, auth } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import toast from "react-hot-toast";

export const DocumentUploader = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setUploadedFile(null);

    try {
      const timestamp = Date.now();
      const fullPath = `users/${user.uid}/documents/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fullPath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          console.error("Upload error:", err);
          setError(err.message);
          toast.error(`Upload failed: ${err.message}`);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const fileData = {
              id: Date.now().toString(),
              name: file.name,
              size: file.size,
              type: file.type || "application/octet-stream",
              url: downloadURL,
              path: fullPath,
              uploadedAt: new Date().toISOString(),
              userId: user.uid
            };

            setUploadedFile(fileData);
            toast.success(`✅ ${file.name} uploaded successfully!`);
            
            if (onUploadComplete) {
              onUploadComplete(fileData);
            }
          } catch (err) {
            console.error("Save error:", err);
            setError(err.message);
            toast.error("Failed to save file metadata");
          } finally {
            setUploading(false);
            setProgress(0);
            e.target.value = "";
          }
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="upload-zone" onClick={handleFileSelect}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls,.txt,.csv"
      />
      
      <div className="upload-icon">
        <UploadCloud size={36} />
      </div>
      <p className="font-medium text-slate-700 dark:text-slate-300">Click to upload documents</p>
      <p className="text-xs text-slate-400 dark:text-slate-500">PDF, DOCX, PNG, JPG (Max 10MB)</p>
      
      {uploading && (
        <div className="mt-4 w-full max-w-xs mx-auto">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle size={16} />
          <span className="truncate">{uploadedFile.name}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
