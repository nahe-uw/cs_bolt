import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // セッションチェック
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { apiUrl } = await req.json();

    // URLのバリデーション
    if (!apiUrl) {
      return NextResponse.json(
        { error: 'API URLは必須です' },
        { status: 400 }
      );
    }

    // 接続テスト
    try {
      console.log('接続テスト開始:', apiUrl);  // デバッグログ
      const startTime = Date.now();

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log('レスポンス:', response.status);  // デバッグログ

      if (!response.ok) {
        throw new Error(`APIサーバーへの接続に失敗しました (${response.status})`);
      }

      return NextResponse.json({
        success: true,
        message: 'API接続テストに成功しました',
        details: {
          status: response.status,
          responseTime: `${responseTime}ms`,
        }
      });
    } catch (error) {
      console.error('接続テストエラー:', error);  // デバッグログ
      return NextResponse.json({
        success: false,
        message: 'APIサーバーへの接続に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('接続テストエラー:', error);
    return NextResponse.json(
      { error: '接続テストに失敗しました' },
      { status: 500 }
    );
  }
}
