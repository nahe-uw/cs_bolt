import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI Response Generator
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            顧客問い合わせに対する自動返信システム
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">
                デモを開始 <LucideArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>簡単セットアップ</CardTitle>
              <CardDescription>
                APIキーを設定するだけで、すぐに利用開始できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              データベース接続からAIモデルの学習まで、すべて自動で設定します
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>高度なカスタマイズ</CardTitle>
              <CardDescription>
                業務に合わせた柔軟な設定が可能
              </CardDescription>
            </CardHeader>
            <CardContent>
              データマッピングやカテゴリ設定で、より正確な回答を生成します
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>セキュアな運用</CardTitle>
              <CardDescription>
                データセキュリティを最優先
              </CardDescription>
            </CardHeader>
            <CardContent>
              すべてのデータは暗号化され、適切なアクセス制御のもとで管理されます
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}