import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// API接続設定を保存
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { api_url, auth_token } = await req.json();

    // バリデーション
    if (!api_url || !auth_token) {
      return NextResponse.json(
        { error: 'API URLと認証トークンは必須です' },
        { status: 400 }
      );
    }

    // 新規設定を作成
    const apiConnection = await prisma.aPIConnection.create({
      data: {
        userId: parseInt(session.user.id),
        apiUrl: api_url,
        apiToken: auth_token,
      },
    });

    return NextResponse.json({ 
      message: 'API接続設定が保存されました',
      apiConnection 
    });
  } catch (error) {
    console.error('API接続設定エラー:', error);
    return NextResponse.json(
      { error: 'API接続設定の保存に失敗しました' },
      { status: 500 }
    );
  }
}

// API接続設定を取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const apiConnection = await prisma.aPIConnection.findFirst({
      where: { userId: parseInt(session.user.id) },
      select: {
        id: true,
        apiUrl: true,
        apiToken: true,
      }
    });

    return NextResponse.json({ apiConnection });
  } catch (error) {
    console.error('API接続設定取得エラー:', error);
    return NextResponse.json(
      { error: 'API接続設定の取得に失敗しました' },
      { status: 500 }
    );
  }
}
