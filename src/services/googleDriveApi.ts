export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  size?: string;
  modifiedTime?: string;
  iconLink?: string;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

// List files in root or specific folder
export async function listDriveFiles(
  token: string,
  folderId: string = 'root',
  pageSize: number = 30
): Promise<DriveFile[]> {
  const query = `'${folderId}' in parents and trashed = false`;
  const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(
    query
  )}&pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,size,modifiedTime,iconLink)&orderBy=folder,name`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to list Google Drive files');
  }

  const data = await res.json();
  return data.files || [];
}

// Search files by keyword
export async function searchDriveFiles(
  token: string,
  keyword: string
): Promise<DriveFile[]> {
  const query = `name contains '${keyword.replace(/'/g, "\\'")}' and trashed = false`;
  const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(
    query
  )}&pageSize=25&fields=files(id,name,mimeType,webViewLink,thumbnailLink,size,modifiedTime,iconLink)&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to search Google Drive files');
  }

  const data = await res.json();
  return data.files || [];
}

// Create a new folder
export async function createDriveFolder(
  token: string,
  folderName: string,
  parentId: string = 'root'
): Promise<DriveFile> {
  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };

  const res = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create Google Drive folder');
  }

  return await res.json();
}

// Upload file to Google Drive using multipart upload
export async function uploadToDrive(
  token: string,
  file: File,
  parentId: string = 'root'
): Promise<DriveFile> {
  const metadata = {
    name: file.name,
    parents: [parentId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to upload file to Google Drive');
  }

  return await res.json();
}

// Delete file from Google Drive (Mandatory user confirmation handled in UI)
export async function deleteDriveFile(
  token: string,
  fileId: string
): Promise<void> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to delete file from Google Drive');
  }
}
