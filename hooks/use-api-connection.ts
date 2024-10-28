import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface APIConnection {
  id: number;
  apiUrl: string;
  apiToken: string;
}

export function useApiConnection() {
  const { data: session } = useSession();
  const [connection, setConnection] = useState<APIConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API接続設定の取得
  const fetchConnection = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/api-connection');
      if (!response.ok) throw new Error('データの取得に失敗しました');
      
      const data = await response.json();
      setConnection(data.apiConnection);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // API接続設定の保存
  const saveConnection = async (apiUrl: string, apiToken: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/api-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_url: apiUrl, auth_token: apiToken }),
      });

      if (!response.ok) throw new Error('データの保存に失敗しました');
      
      const data = await response.json();
      setConnection(data.apiConnection);
      setError(null);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // セッションが変更されたらデータを再取得
  useEffect(() => {
    if (session) {
      fetchConnection();
    }
  }, [session]);

  // API接続テスト
  const testConnection = async (apiUrl: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/api-connection/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'テストに失敗しました');
      }

      return {
        success: true,
        message: data.message,
        details: data.details
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connection,
    isLoading,
    error,
    fetchConnection,
    saveConnection,
    testConnection,
  };
}
