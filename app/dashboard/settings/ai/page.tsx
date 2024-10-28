"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Upload, BookOpen } from "lucide-react";

export default function AISettings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI設定</h1>

      <Tabs defaultValue="vertex" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vertex">Vertex AI設定</TabsTrigger>
          <TabsTrigger value="training">学習データ</TabsTrigger>
          <TabsTrigger value="knowledge">ナレッジベース</TabsTrigger>
        </TabsList>

        <TabsContent value="vertex">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Vertex AI設定
              </CardTitle>
              <CardDescription>
                Google Cloud Vertex AIとの連携設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey">サービスアカウントキー (JSON)</Label>
                <Input id="secretKey" type="file" accept=".json" />
              </div>
              <Button className="w-full">設定を保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                学習データ管理
              </CardTitle>
              <CardDescription>
                AIモデルの学習に使用するデータ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trainingData">トレーニングデータ (CSV/JSON)</Label>
                <Input id="trainingData" type="file" accept=".csv,.json" />
              </div>
              <Button className="w-full">アップロード</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                ナレッジベース
              </CardTitle>
              <CardDescription>
                追加の学習リソース
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="knowledgeUrl">ナレッジURL</Label>
                <Input id="knowledgeUrl" placeholder="https://docs.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="knowledgeFile">ナレッジファイル (PDF)</Label>
                <Input id="knowledgeFile" type="file" accept=".pdf" />
              </div>
              <Button className="w-full">追加</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}