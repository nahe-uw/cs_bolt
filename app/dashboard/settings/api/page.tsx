"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useApiConnection } from "@/hooks/use-api-connection";

export default function ApiSettingsPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const { toast } = useToast();
  const {
    connection,
    isLoading,
    error,
    saveConnection,
    fetchConnection,
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
    console.log('接続テスト開始'); // デバッグログ追加
    if (!apiUrl) {
      toast({
        title: "エラー",
        description: "API URLを入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('APIリクエスト送信:', apiUrl); // デバッグログ追加
      const result = await testConnection(apiUrl);
      console.log('テスト結果:', result); // デバッグログ追加
      
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
      console.error('テストエラー:', error); // デバッグログ追加
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "接続テストに失敗しました",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "エラー",
      description: error,
      variant: "destructive",
    });
  }

  console.log('isLoading:', isLoading); // デバッグログ追加

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>API設定</CardTitle>
          <CardDescription>
            クライアントのデータベースとの接続設定
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            </div>
          </form>
          {/* フォームの外にテストボタンを移動 */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "テスト中..." : "接続テスト"}
            </Button>
            {/* テスト用の新しいボタンを追加 */}
            <Button
              type="button"
              onClick={() => {
                console.log('テストボタンがクリックされました');
                alert('テストボタンがクリックされました');
              }}
              className="w-full mt-2"
            >
              テストボタン
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
