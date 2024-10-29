import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    console.log('セッションID:', session.user.id);

    // ユーザーのAPI接続情報をすべて取得
    const apiConnections = await prisma.aPIConnection.findMany({
      where: { userId: parseInt(session.user.id) }
    });

    console.log('API接続情報:', apiConnections);

    if (!apiConnections.length) {
      return NextResponse.json(
        { error: 'API接続設定が見つかりません' },
        { status: 404 }
      );
    }

    const allTables = [];

    for (const apiConnection of apiConnections) {
      try {
        console.log('API URL:', `${apiConnection.apiUrl}`);

        const response = await fetch(`${apiConnection.apiUrl}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiConnection.apiToken}`,
          },
        });

        console.log('APIレスポンス:', response.status);

        if (!response.ok) {
          throw new Error(`テーブル構造の取得に失敗しました (${response.status})`);
        }

        const data = await response.json();
        console.log('取得したデータ:', data);

        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
          throw new Error('無効なデータ形式です。オブジェクト形式のデータが必要です。');
        }

        // 削除対象のテーブルを確認
        const existingTables = await prisma.table.findMany({
          where: { apiConnectionId: apiConnection.id }
        });

        const tablesToDelete = existingTables.filter(table => {
          return !Object.keys(data).includes(table.tableName);
        });

        if (tablesToDelete.length > 0) {
          await prisma.table.deleteMany({
            where: {
              id: { in: tablesToDelete.map(table => table.id) }
            }
          });
        }

        // 新しいテーブルを作成
        const savedTables = await Promise.all(
          Object.keys(data).map(async (tableName) => {
            const existingTable = await prisma.table.findFirst({
              where: {
                apiConnectionId: apiConnection.id,
                tableName: tableName,
              },
            });

            if (!existingTable) {
              return await prisma.table.create({
                data: {
                  apiConnectionId: apiConnection.id,
                  tableName: tableName,
                },
              });
            }
            return existingTable;
          })
        );

        console.log('保存したテーブル:', savedTables);

        allTables.push(...savedTables);
      } catch (error) {
        console.error('テーブル取得エラー詳細:', error);
      }
    }

    // すべてのAPI接続に関連するテーブル情報を取得して返す
    const storedTables = await prisma.table.findMany({
      where: {
        apiConnectionId: {
          in: apiConnections.map(conn => conn.id)
        }
      },
      include: {
        apiConnection: {
          select: {
            apiUrl: true
          }
        }
      }
    });

    // API URLを含めてレスポンスを整形
    const tablesWithUrl = storedTables.map(table => ({
      id: table.id,
      apiConnectionId: table.apiConnectionId,
      tableName: table.tableName,
      apiUrl: table.apiConnection.apiUrl
    }));

    return NextResponse.json({
      message: 'テーブル構造を取得しました',
      tables: tablesWithUrl,
    });
  } catch (error) {
    console.error('API処理エラー詳細:', error);
    return NextResponse.json(
      { error: 'テーブル構造の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
      }
  
      const { tableIds } = await req.json();
  
      if (!Array.isArray(tableIds) || tableIds.length === 0) {
        return NextResponse.json({ error: '削除するテーブルが選択されていません' }, { status: 400 });
      }
  
      // 選択されたテーブル情報を削除
      await prisma.table.deleteMany({
        where: {
          id: { in: tableIds },
          apiConnection: {
            userId: parseInt(session.user.id)
          }
        }
      });
  
      // 削除したテーブルに関連するAPI接続情報を、他に関連するテーブルがなければ削除
      const apiConnectionIds = await prisma.aPIConnection.findMany({
        where: {
          userId: parseInt(session.user.id),
          tables: { none: {} } // 他に関連するテーブルがないAPI接続のみ選択
        },
        select: { id: true }
      });
  
      if (apiConnectionIds.length > 0) {
        await prisma.aPIConnection.deleteMany({
          where: {
            id: { in: apiConnectionIds.map(conn => conn.id) }
          }
        });
      }
  
      return NextResponse.json({
        message: '選択したテーブルと不要なAPI接続を削除しました'
      });
    } catch (error) {
      console.error('テーブル情報削除エラー:', error);
      return NextResponse.json(
        { error: 'テーブル情報の削除に失敗しました' },
        { status: 500 }
      );
    }
}

// // API接続情報の削除
// export async function DELETE(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
//     }

//     const { tableIds } = await req.json();

//     if (!Array.isArray(tableIds) || tableIds.length === 0) {
//       return NextResponse.json({ error: '削除するテーブルが選択されていません' }, { status: 400 });
//     }

//     // 選択されたテーブル情報を削除
//     const deletedTables = await prisma.table.deleteMany({
//       where: {
//         id: { in: tableIds },
//         apiConnection: {
//           userId: parseInt(session.user.id)
//         }
//       }
//     });

//     // 削除されたテーブルに関連するAPI接続情報を削除
//     const apiConnectionIds = await prisma.table.findMany({
//       where: { id: { in: tableIds } },
//       select: { apiConnectionId: true }
//     });

//     await prisma.aPIConnection.deleteMany({
//       where: {
//         id: { in: apiConnectionIds.map(conn => conn.apiConnectionId) },
//         userId: parseInt(session.user.id)
//       }
//     });

//     return NextResponse.json({
//       message: '選択したテーブル情報と関連するAPI接続情報を削除しました'
//     });
//   } catch (error) {
//     console.error('テーブル情報削除エラー:', error);
//     return NextResponse.json(
//       { error: 'テーブル情報の削除に失敗しました' },
//       { status: 500 }
//     );
//   }
// }
