/*
  # ユーザー権限システムの追加

  1. テーブル変更
    - `users`テーブルに`role`カラムを追加（'user' または 'admin'）
    - デフォルト値は'user'

  2. セキュリティポリシーの更新
    - ユーザーは自分のデータを挿入・更新可能
    - 管理者は全てのユーザーデータを更新可能
    - 管理者のみが他のユーザーを削除可能（自分自身は削除不可）

  3. 初期設定
    - 最初に登録されたユーザーを管理者に設定
*/

-- Step 1: usersテーブルにroleカラムを追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Step 2: roleカラムに制約を追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'users_role_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Step 3: 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data or admins can update all" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Step 4: 最初の管理者アカウントを作成するための関数を先に定義
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

-- Step 6: 管理者チェック用のヘルパー関数を作成
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Step 7: 新しいRLSポリシーを作成
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
    auth.uid() = id OR is_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = id OR is_admin(auth.uid())
  );

-- 管理者のみが他のユーザーを削除可能（自分自身は削除不可）
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() != id AND is_admin(auth.uid())
  );