import { useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface StorageFileState {
  url: string | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 依 Storage 路徑取得檔案的下載連結。
 * @param path Firebase Storage 內的檔案路徑,例如 "images/avatar.png"
 *
 * 用法:
 *   const { url, loading, error } = useStorageFile('images/avatar.png');
 */
export function useStorageFile(path: string | null): StorageFileState {
  const [state, setState] = useState<StorageFileState>({
    url: null,
    loading: !!path,
    error: null,
  });

  useEffect(() => {
    if (!path) {
      setState({ url: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ url: null, loading: true, error: null });

    getDownloadURL(ref(storage, path))
      .then((url) => {
        if (!cancelled) setState({ url, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ url: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
