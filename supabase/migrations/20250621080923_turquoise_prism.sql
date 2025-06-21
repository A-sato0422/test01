/*
  # ユーザー権限システムの追加

  1. テーブル変更
    - `users`テーブルに`role`カラムを追加
    - デフォルトは'user'（一般権限）
    - 'admin'（管理権限）も設定可能

  2. セキュリティ
    - 管理者のみが他のユーザーを編集・削除可能
    - 一般ユーザーは自分のデータのみ編集可能
*/

-- usersテーブルにroleカラムを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- 新しいRLSポリシーを作成
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

-- 管理者のみが他のユーザーを削除可能
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 最初の管理者アカウントを作成するための一時的なポリシー
-- 実際の運用では、最初の管理者は手動で設定することを推奨
CREATE OR REPLACE FUNCTION create_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 管理者が存在しない場合のみ実行
  IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin') THEN
    -- 最初に登録されたユーザーを管理者にする（オプション）
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