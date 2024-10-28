"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideArrowRight, Settings, MessageSquare, Database } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              問い合わせ対応
            </CardTitle>
            <CardDescription>
              AIを活用して問い合わせに自動で返信
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>ユーザーIDと問い合わせ内容から、最適な返信を自動生成します。</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/inquiry">
                問い合わせ対応を開始 <LucideArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              データ設定
            </CardTitle>
            <CardDescription>
              データベース接続とマッピング
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>APIの接続設定やデータのマッピングを行います。</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/settings/data">
                データ設定を開く <LucideArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              AI設定
            </CardTitle>
            <CardDescription>
              AIモデルの設定と学習
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Vertex AIの設定や学習データの管理を行います。</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/settings/ai">
                AI設定を開く <LucideArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}