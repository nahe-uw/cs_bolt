import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // セッションチェック
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    console.log('セッションID:', session.user.id); // デバッグログ

    // ユーザーのAPI接続情報を取得
    const apiConnection = await prisma.aPIConnection.findFirst({
      where: { userId: parseInt(session.user.id) }
    });

    console.log('API接続情報:', apiConnection); // デバッグログ

    if (!apiConnection) {
      return NextResponse.json(
        { error: 'API接続設定が見つかりません' },
        { status: 404 }
      );
    }

    try {
      console.log('API URL:', `${apiConnection.apiUrl}`); // デバッグログ

      const response = await fetch(`${apiConnection.apiUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiConnection.apiToken}`,
        },
      });

      console.log('APIレスポンス:', response.status); // デバッグログ

      if (!response.ok) {
        throw new Error(`テーブル構造の取得に失敗しました (${response.status})`);
      }

      const data = await response.json();
      console.log('取得したデータ:', data); // レスポンスの構造を確認

      // データ形式の検証
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('無効なデータ形式です。オブジェクト形式のデータが必要です。');
      }

      // 既存のテーブル情報を削除
      await prisma.table.deleteMany({
        where: { apiConnectionId: apiConnection.id }
      });
      // APIレスポンスのデータ構造を確認
      console.log('取得したデータ:', data);

      // オブジェクトのキーをテーブル名として保存
      const savedTables = await Promise.all(
        Object.keys(data).map(async (tableName) => {
          return await prisma.table.create({
            data: {
              apiConnectionId: apiConnection.id,
              tableName: tableName,
            },
          });
        })
      );

      console.log('保存したテーブル:', savedTables);

      // 保存したテーブル情報を取得して返す
      const storedTables = await prisma.table.findMany({
        where: { apiConnectionId: apiConnection.id },
        include: {
          apiConnection: {
            select: {
              apiUrl: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'テーブル構造を取得しました',
        tables: storedTables,
      });
    } catch (error) {
      console.error('テーブル取得エラー詳細:', error); // デバッグログ
      return NextResponse.json({
        error: 'テーブル構造の取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('API処理エラー詳細:', error); // デバッグログ
    return NextResponse.json(
      { error: 'テーブル構造の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// テーブル情報の削除
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザーのAPI接続情報を取得
    const apiConnection = await prisma.aPIConnection.findFirst({
      where: { userId: parseInt(session.user.id) }
    });

    if (!apiConnection) {
      return NextResponse.json(
        { error: 'API接続設定が見つかりません' },
        { status: 404 }
      );
    }

    // このAPI接続に関連するテーブル情報を削除
    await prisma.table.deleteMany({
      where: { apiConnectionId: apiConnection.id }
    });

    return NextResponse.json({
      message: 'テーブル情報を削除しました'
    });
  } catch (error) {
    console.error('テーブル情報削除エラー:', error);
    return NextResponse.json(
      { error: 'テーブル情報の削除に失敗しました' },
      { status: 500 }
    );
  }
}
