import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { storage, db, auth } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export default function DocumentManager() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      setStatus({ type: 'error', message: 'Please login first' });
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatus({ type: 'info', message: 'Uploading...' });

    try {
      const storageRef = ref(storage, `users/${user.uid}/documents/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          console.error(error);
          setStatus({ type: 'error', message: 'Upload failed: ' + error.message });
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            await setDoc(doc(db, "users", user.uid, "documents", Date.now().toString()), {
              fileName: file.name,
              fileUrl: downloadURL,
              fileSize: file.size,
              fileType: file.type,
              uploadedAt: new Date().toISOString(),
              userId: user.uid
            });

            setUploadedFiles(prev => [...prev, { name: file.name, url: downloadURL }]);
            setStatus({ type: 'success', message: `✅ ${file.name} uploaded successfully!` });
            setUploading(false);
            setProgress(0);
          } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to save file metadata' });
            setUploading(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Upload failed' });
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls"
      />

      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
        <FileText className="text-blue-600" size={24} />
        Document Management
      </h2>

      {status.message && (
        <div className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-sm ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {status.type === 'success' && <CheckCircle2 size={18} />}
          {status.type === 'error' && <AlertCircle size={18} />}
          {status.type === 'info' && <Loader2 size={18} className="animate-spin" />}
          <span>{status.message}</span>
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Uploading...</span>
            <span className="font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div 
        onClick={handleFileSelect}
        className="border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50 transition-all rounded-2xl p-8 text-center cursor-pointer"
      >
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Upload size={24} />
        </div>
        <h3 className="font-semibold text-slate-700">Click to upload documents</h3>
        <p className="text-sm text-slate-400 mt-1">PDF, Word, Excel, Images (Max 10MB)</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-sm text-slate-600 mb-2">Uploaded Files:</h4>
          <div className="space-y-1">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                <FileText size={14} className="text-blue-600" />
                <span>{file.name}</span>
                <CheckCircle2 size={14} className="text-green-600 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
