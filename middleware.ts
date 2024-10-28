import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 未認証ユーザーの場合
    if (!isAuth) {
      // ダッシュボードへのアクセスを試みた場合のみリダイレクト
      if (path.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      // その他のパスはそのまま通す
      return NextResponse.next();
    }

    // 認証済みユーザーの場合
    if (path.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true  // 常にミドルウェアを実行
    },
  }
);

// 保護するパスを指定（ホームページは除外）
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};
