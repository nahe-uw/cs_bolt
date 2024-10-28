"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Table, Link as LinkIcon } from "lucide-react";
import { ApiSettingsForm } from "@/components/api-settings-form";

export default function DataSettings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">データ設定</h1>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection">API接続設定</TabsTrigger>
          <TabsTrigger value="mapping">データマッピング</TabsTrigger>
          <TabsTrigger value="categories">カテゴリ設定</TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API接続設定
              </CardTitle>
              <CardDescription>
                クライアントのデータベースとの接続設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                データマッピング
              </CardTitle>
              <CardDescription>
                テーブルとカラムの意味づけ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">先にAPI接続を設定してください。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                カテゴリ設定
              </CardTitle>
              <CardDescription>
                データのカテゴリ分類
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">先にデータマッピングを完了してください。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
