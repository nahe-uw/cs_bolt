import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Table {
  id: number;
  apiConnectionId: number;
  tableName: string;
  apiUrl?: string; // API URLを追加
}

export function useTableStructure() {
  const { data: session } = useSession();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // テーブル構造の取得
  const fetchTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings/tables');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'テーブル構造の取得に失敗しました');
      }
      
      const data = await response.json();
      setTables(data.tables);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントマウント時に自動でデータを取得
  useEffect(() => {
    if (session) {
      fetchTables();
    }
  }, [session]);

  // テーブル情報の削除
  const deleteTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings/tables', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'テーブル情報の削除に失敗しました');
      }
      
      setTables([]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tables,
    isLoading,
    error,
    fetchTables,  // 手動更新用に残しておく
    deleteTables,
  };
}
