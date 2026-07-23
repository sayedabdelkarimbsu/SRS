import { useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import toast from "react-hot-toast";

export const useAutoSave = (userId, data, delay = 1500) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!userId || !data) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      setSavedStatus("⏳ Saving...");
      try {
        await setDoc(
          doc(db, "users", userId),
          { profile: data, updatedAt: new Date().toISOString() },
          { merge: true }
        );
        setSavedStatus("✅ Auto-saved");
        toast.success("Auto-saved!", { duration: 2000 });
      } catch (error) {
        console.error("Auto-save error:", error);
        setSavedStatus("❌ Save failed");
        toast.error("Auto-save failed");
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, userId, delay]);

  return { isSaving, savedStatus };
};
