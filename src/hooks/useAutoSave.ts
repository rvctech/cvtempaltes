import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

const STORAGE_KEY = 'cv-builder-data';
const SAVE_INTERVAL = 30000; // 30 seconds

interface SavedData {
  cvData: any;
  coverLetterData: any;
  selectedTemplateId: string;
  customization: any;
  savedAt: string;
}

export const useAutoSave = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { cvData, coverLetterData, selectedTemplateId, customization } = useStore();

  const save = () => {
    try {
      const data: SavedData = {
        cvData,
        coverLetterData,
        selectedTemplateId,
        customization,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const load = (): SavedData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SavedData;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    intervalRef.current = setInterval(save, SAVE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cvData, coverLetterData, selectedTemplateId, customization]);

  return { save, load, clear };
};

export const useSessionRecovery = () => {
  const { setCVData, setCoverLetterData, setSelectedTemplate, updateCustomization } = useStore();

  const recover = (): boolean => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const data = JSON.parse(raw) as SavedData;
      if (data.cvData) setCVData(data.cvData);
      if (data.coverLetterData) setCoverLetterData(data.coverLetterData);
      if (data.selectedTemplateId) setSelectedTemplate(data.selectedTemplateId);
      if (data.customization) updateCustomization(data.customization);

      return true;
    } catch (error) {
      console.error('Session recovery failed:', error);
      return false;
    }
  };

  return { recover };
};