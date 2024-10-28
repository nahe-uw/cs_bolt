# プロジェクト概要
このプロジェクトは、クライアントが「ユーザーID」と「問い合わせ内容」を入力すると、自動で返信文章を生成するサービスを構築することです。サービスはWeb上で完結し、誰でも使いやすいことを目指します。

- **MVP（Minimum Viable Product）を目指し、メイン機能以外の開発は行わない。**
- **セキュリティを重視し、クライアントのデータベースとの接続は安全に行う。**

# 開発環境

## プログラミング言語:
- Node.js (v18.0.0以上)
- Python (v3.8以上)

## フレームワーク・ライブラリ:
- Next.js
- NextAuth.js
- Prisma

## データベース:
- MySQL（初期はReplit内でホスティング、スケールに応じてクラウドデータベースに移行）

## エディタ:
- Cursor / VSCode（推奨）

## その他ツール:
- Git（GitHubで管理）
- Replit（デプロイ環境）
- OpenAI API Key

# 用語定義
- **サービス:** 今回開発するWebアプリケーション
- **クライアント:** サービスを利用する事業者
- **ユーザー:** クライアントの顧客

# システム構成とフロー

## フロー図

### データ取得
1. ユーザーID入力 → APIにてデータ取得 → データ要約作成 → Vertex AIに送信

### 問い合わせ内容処理
1. 問い合わせ内容入力 → GPTにて分解/要約 → 各質問ごとにループ処理でデータ送信 → 個別に回答生成

### 回答生成と修正
1. 各質問に対する回答生成 → クライアントが修正 → 修正データを学習 → 次回以降の回答精度向上

# ページと機能

## 5.1 ユーザー認証ページ（サインイン/サインアップ）

**目的:** ユーザーが自分のアカウントでログイン・サインアップできる機能  
**機能要件:**
- サインアップ: メールアドレスとパスワードでアカウントを作成
- ログイン: メールアドレスとパスワードでログイン
- ログイン後のアクセス: 問い合わせ内容の要約を生成するページや履歴ページにアクセス可能
- ログイン状態の表示: ログインしているメールアドレスを画面に表示
- **技術選択:** NextAuth.js を使用

## 5.2 API接続 / 確認ページ

**目的:** クライアントのデータベースと接続し、テーブル構造を取得・保存する  
**機能要件:**
- API情報の入力: 「API URL」と「認証トークン」を入力するフォームを用意
- データベース構造の取得: APIを通じてテーブル名とカラム名を取得
- データの保存と表示: 「API URL」「認証トークン」「取得したデータベース構造」を保存し、画面に表示
- データセットの削除: 保存したデータセットを削除する機能を提供
- **技術要件:** APIの種類: REST API、認証方式: APIキーによる認証

## 5.3 マッピングページ

**目的:** データの意味づけとテーブル間の関係を設定する  
**機能要件:**
- **テーブルとカラムの意味づけ:**
  - `Table_mapping`: テーブルが保持するデータの説明を入力
  - `Column_mapping`: 各カラムのデータ内容を入力
- **値の意味づけ（Value_mapping）:** 特定のカラムの値とその意味を登録。「追加」ボタンによりフォームを追加して複数登録可能
  - 例: `gender` カラムで `1` が「男性」、`2` が「女性」
- **カラムによるテーブルの連結:** 「連結」ボタンで他のテーブルのカラムを選択し、リレーションを設定。選択肢を「テーブル名.カラム名」としてドロップダウンで表示
- **一括マッピング機能:** CSV形式のファイルをアップロードしてマッピングを一括登録
  - CSV形式: 「table_name」「column_name」「value」「meaning」
- **ユーザーIDの設定:** マッピング時にどのカラムがユーザーIDに該当するかを設定

## 5.4 データカテゴリ生成ページ

**目的:** テーブルをカテゴリにグルーピングし、必要なデータを効率的に取得する  
**機能要件:**
- **カテゴリの自動生成:** GPTを使用して、マッピングデータを基にテーブルをグルーピング
- **クライアントによる編集:** カテゴリ名の変更、テーブルの追加・削除
- **連携制約:** ユーザーIDに直接連結できないテーブルは、自動的に追加・削除される
- **データの保存:** 編集・同意したカテゴリ情報はデータベースに保存

## 5.5 Vertex AI 学習ページ

**目的:** クライアントのデータを用いてモデルをトレーニングし、回答精度を向上させる  
**機能要件:**
- **セキュリティと認証の設定:** クライアントはサービスアカウントの秘密鍵（JSONファイル）をサービスに登録
- **データのアップロードと管理:** トレーニングデータをCSVやJSON形式でアップロード
- **モデルの自動作成とトレーニング:** Vertex AIのAPIを呼び出し、モデルの作成とトレーニングを自動化
- **学習データの管理:** ナレッジデータや学習データは暗号化して保存

## 5.6 問い合わせページ

**目的:** ユーザーからの問い合わせに対する自動返信を生成  
**機能要件:**
- **入力フォーム:** ユーザーID、問い合わせ文章、参照カテゴリを選択
- **回答生成:** データ取得、データ要約、回答生成
- **回答の修正と学習:** 修正した回答を学習フローに反映、保存


# データベース設計

## 6.1 サービスのデータベース

### 1. ユーザーテーブル（Users）
**目的:** サービスを利用するクライアント（事業者）の認証と管理  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): ユーザーID
- `email` (VARCHAR, UNIQUE, NOT NULL): メールアドレス
- `password` (VARCHAR, NOT NULL): ハッシュ化されたパスワード
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): アカウント作成日時
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): アカウント情報更新日時

## 2. API接続テーブル（APIConnections）
**目的:** クライアントのデータベースAPI接続情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 接続情報ID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `api_url` (VARCHAR, NOT NULL): APIエンドポイントURL
- `auth_token` (VARCHAR, NOT NULL): 認証トークン（暗号化して保存）
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 更新日時

## 3. マッピングデータテーブル（MappingData）
**目的:** クライアントのデータベース構造のマッピング情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): マッピングデータID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `table_name` (VARCHAR, NOT NULL): テーブル名
- `table_description` (TEXT): テーブルの説明
- `column_name` (VARCHAR, NOT NULL): カラム名
- `column_description` (TEXT): カラムの説明
- `is_user_id` (BOOLEAN, DEFAULT FALSE): ユーザーIDを表すカラムかどうか
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 更新日時

## 4. 値の意味づけテーブル（ValueMappings）
**目的:** カラム内の特定の値とその意味を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 値マッピングID
- `mapping_data_id` (INT, FOREIGN KEY REFERENCES MappingData(id), NOT NULL): マッピングデータID
- `value` (VARCHAR, NOT NULL): カラム内の値
- `meaning` (VARCHAR, NOT NULL): 値の意味
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時

## 5. テーブル連結テーブル（TableRelations）
**目的:** テーブル間のリレーション情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): リレーションID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `from_table` (VARCHAR, NOT NULL): リレーション元のテーブル名
- `from_column` (VARCHAR, NOT NULL): リレーション元のカラム名
- `to_table` (VARCHAR, NOT NULL): リレーション先のテーブル名
- `to_column` (VARCHAR, NOT NULL): リレーション先のカラム名
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時

## 6. データカテゴリテーブル（DataCategories）
**目的:** データカテゴリの情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): カテゴリID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `category_name` (VARCHAR, NOT NULL): カテゴリ名
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時


## 7. カテゴリテーブルマッピングテーブル（CategoryTableMappings）
**目的:** カテゴリとテーブルの紐付けを保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): レコードID
- `category_id` (INT, FOREIGN KEY REFERENCES DataCategories(id), NOT NULL): カテゴリID
- `table_name` (VARCHAR, NOT NULL): テーブル名
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時


## 8. ナレッジテーブル（Knowledge）
**目的:** ナレッジ情報（URLやPDF）の登録を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): ナレッジID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `knowledge_name` (VARCHAR, NOT NULL): ナレッジ名
- `type` (ENUM('url', 'pdf'), NOT NULL): ナレッジの種類
- `content` (TEXT, NOT NULL): ナレッジの内容またはファイルパス
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時


## 9. 学習モデル情報テーブル（TrainingModels）
**目的:** Vertex AIで作成されたモデル情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): モデルID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `model_name` (VARCHAR, NOT NULL): モデル名
- `endpoint_url` (VARCHAR, NOT NULL): エンドポイントURL
- `status` (VARCHAR, NOT NULL): モデルのステータス（例: 'training', 'deployed'）
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 作成日時
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 更新日時


## 10. 問い合わせ履歴テーブル（InquiryHistory）
**目的:** 問い合わせ内容と生成された回答の履歴を保存（保存期間は7日間）  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): 履歴ID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `customer_user_id` (VARCHAR, NOT NULL): クライアントの顧客のユーザーID
- `inquiry_content` (TEXT, NOT NULL): 問い合わせ内容
- `generated_response` (TEXT, NOT NULL): 生成された回答
- `corrected_response` (TEXT): クライアントが修正した回答
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 作成日時


## 11. サービスアカウント情報テーブル（ServiceAccounts）
**目的:** クライアントのVertex AIへのアクセス情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): レコードID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `service_account_key` (TEXT, NOT NULL): サービスアカウントの秘密鍵（暗号化して保存）
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): 登録日時


## 12. トレーニングデータテーブル（TrainingData）
**目的:** クライアントがアップロードしたトレーニングデータの情報を保存  
**カラム:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT): データID
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NOT NULL): ユーザーID
- `file_name` (VARCHAR, NOT NULL): ファイル名
- `file_path` (VARCHAR, NOT NULL): ファイルの保存パス
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP): アップロード日時



## 7.1 セキュリティ
- **データ保護:** クライアントの秘密鍵や学習データは暗号化して保存
- **アクセス制限:** クライアントごとにデータを分離し、適切なアクセス制御を実施
- **通信の暗号化:** すべての通信はHTTPSを使用

## 7.2 パフォーマンス
- **API応答時間:** 応答時間を3秒以内に抑える
- **スケーラビリティ:** 将来的なユーザー増加に対応できる設計

## 7.3 テストと品質保証
- **ユニットテスト:** 各機能の正常系・異常系をテスト
- **統合テスト:** フロー全体の動作確認
- **セキュリティテスト:** 脆弱性の検査（SQLインジェクション、XSSなど）

# エラーハンドリング

- **ユーザー入力エラー:**
  - ユーザーIDが一致しない: 「ユーザーIDが一致しません」と表示
  - 問い合わせ内容が未入力: 「問い合わせ内容が入力されていません」と表示
- **システム
