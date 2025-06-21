/*
  # ユーザー権限システムの追加

  1. テーブル変更
    - `users`テーブルに`role`カラムを追加
    - デフォルト値: 'user'
    - 制約: 'user' または 'admin' のみ

  2. セキュリティ
    - ユーザーは自分のデータのみ挿入・更新可能
    - 管理者は全ユーザーのデータを更新・削除可能
    - 最初のユーザーを自動的に管理者に設定する機能

  3. 関数
    - 最初の管理者を作成する関数
*/

-- Step 1: usersテーブルにroleカラムを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Step 2: 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data or admins can update all" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Step 3: 新しいRLSポリシーを作成
-- ユーザーは自分のデータを挿入可能
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ユーザーは自分のデータを更新可能、管理者は全てのユーザーを更新可能
CREATE POLICY "Users can update own data or admins can update all"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理者のみが他のユーザーを削除可能（自分自身は削除不可）
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() != id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 4: 最初の管理者アカウントを作成するための関数
CREATE OR REPLACE FUNCTION create_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 管理者が存在しない場合のみ実行
  IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin') THEN
    -- 最初に登録されたユーザーを管理者にする
    UPDATE users 
    SET role = 'admin' 
    WHERE id = (
      SELECT id FROM users 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END;
$$;

-- Step 5: 最初の管理者を作成（既存ユーザーがいる場合）
SELECT create_first_admin();