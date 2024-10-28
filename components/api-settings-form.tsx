"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useApiConnection } from "@/hooks/use-api-connection";
import { useState, useEffect } from "react";

export function ApiSettingsForm() {
  const [apiUrl, setApiUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const { toast } = useToast();
  const {
    connection,
    isLoading,
    error,
    saveConnection,
    testConnection
  } = useApiConnection();

  // 既存の設定を読み込み
  useEffect(() => {
    if (connection) {
      setApiUrl(connection.apiUrl);
      setAuthToken(connection.apiToken);
    }
  }, [connection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await saveConnection(apiUrl, authToken);
      if (success) {
        toast({
          title: "保存完了",
          description: "API設定が保存されました",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "エラーが発生しました",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    console.log('接続テスト開始');
    if (!apiUrl) {
      toast({
        title: "エラー",
        description: "API URLを入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await testConnection(apiUrl);
      
      if (result.success) {
        toast({
          title: "接続成功",
          description: result.message,
        });
      } else {
        toast({
          title: "接続失敗",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "接続テストに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiUrl">API URL</Label>
          <Input
            id="apiUrl"
            type="url"
            placeholder="https://api.example.com/v1"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="authToken">認証トークン</Label>
          <Input
            id="authToken"
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "保存中..." : "保存"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            disabled={isLoading}
          >
            {isLoading ? "テスト中..." : "接続テスト"}
          </Button>
        </div>
      </form>
    </div>
  );
}
