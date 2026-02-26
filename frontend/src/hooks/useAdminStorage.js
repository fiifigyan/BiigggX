import { useMutation } from 'convex/react';
import { useState } from 'react';

/**
 * Handles the three-step Convex file storage upload cycle:
 *   1. generateUploadUrl mutation → get a short-lived presigned upload URL
 *   2. POST the raw file bytes to that URL (Content-Type = file.type)
 *   3. Parse { storageId } from the response JSON
 *
 * Returns the raw storageId. The caller is responsible for resolving it
 * to a permanent CDN URL via a Convex mutation (e.g. saveMerchImage or
 * resolveStorageUrl).
 *
 * @param {object} generateUrlMutation - api.functions.*.generateUploadUrl ref
 */
export function useStorageUpload(generateUrlMutation) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const generateUploadUrl = useMutation(generateUrlMutation);

  async function uploadFile(file) {
    setUploading(true);
    setError(null);
    try {
      // Step 1: get the presigned upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: POST the raw file — Convex expects raw bytes, NOT multipart/form-data
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: HTTP ${res.status}`);
      }

      // Step 3: storageId is returned in the response JSON
      const { storageId } = await res.json();
      return storageId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return { uploadFile, uploading, error };
}
