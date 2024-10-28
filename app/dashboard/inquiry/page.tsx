"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Sparkles } from "lucide-react";

export default function Inquiry() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">問い合わせ対応</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              問い合わせ内容
            </CardTitle>
            <CardDescription>
              ユーザーIDと問い合わせ内容を入力
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">ユーザーID</Label>
              <Input id="userId" placeholder="例: USER123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiry">問い合わせ内容</Label>
              <Textarea
                id="inquiry"
                placeholder="問い合わせ内容を入力してください"
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>参照カテゴリ</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="profile" />
                  <label htmlFor="profile">プロフィール</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity" />
                  <label htmlFor="activity">活動履歴</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="payment" />
                  <label htmlFor="payment">支払い情報</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="settings" />
                  <label htmlFor="settings">設定情報</label>
                </div>
              </div>
            </div>
            <Button className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              回答を生成
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              生成された回答
            </CardTitle>
            <CardDescription>
              AIが生成した回答内容
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="回答は自動生成されます"
              className="min-h-[300px]"
              readOnly
            />
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline">
                修正して学習
              </Button>
              <Button className="flex-1">
                回答を確定
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}