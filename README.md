# YouTube World View Creator

**AI × 四柱推命 × 算命学** で、YouTubeチャンネルの世界観を自動生成するWebアプリケーション

## 概要

YouTubeクリエイターの個性（四柱推命・算命学による鑑定結果）とターゲット視聴者の嗜好を調和させた、最適な世界観コンセプトを自動生成します。

### 主要機能

- 四柱推命・算命学による性格・特性分析
- **Gemini AIによる詳細鑑定分析**（オプション）
  - 基本命式の解説
  - 十干構造からの特性分析
  - 算命学的資質の詳細分析
  - 演者タイプの分類
  - AI生成の世界観コンセプト提案
- 世界観コンセプト自動生成（カラーパレット、トーン&マナー含む）
- サンプル画像表示（撮影イメージ、サムネイル）
- 総合レポート表示

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **AI/LLM**: Gemini 1.5 Pro (詳細鑑定分析)
- **データベース**: PostgreSQL + Prisma ORM (オプション)
- **画像**: プレースホルダー表示（実際の画像生成にはStable Diffusion API、DALL-E APIなどの統合が必要）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
# または
pnpm install
# または
yarn install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成：

```bash
cp .env.example .env.local
```

`.env.local`を編集：

```env
# Database (ローカル開発用)
DATABASE_URL="postgresql://user:password@localhost:5432/youtube_worldview"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3003"
NODE_ENV="development"
```

### 3. データベースのセットアップ

```bash
# Prismaクライアント生成
npx prisma generate

# マイグレーション実行（PostgreSQLが起動している場合）
npx prisma migrate dev

# Prisma Studioで確認（オプション）
npx prisma studio
```

**注意**: データベース機能は現在開発中です。データベースなしでも、分析機能は動作します。

### 4. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3003](http://localhost:3003) を開きます。

## 使い方

### 1. クリエイター情報を入力

- 名前（芸名可）
- 生年月日・出生時刻
- 性別、国籍
- 参入ジャンル（VLOG、ゲーム実況、美容・コスメ等）
- ターゲット視聴者（年齢層、性別）

### 2. Gemini APIキー（必須）

**このアプリケーションはGemini APIキーが必須です。**
- [Google AI Studio](https://aistudio.google.com/app/apikey)でAPIキーを無料で取得してください
- Gemini AIが以下の全ての鑑定分析を行います：
  - ✨ **基本命式**（例：「市中水明」「山頭火」など）
  - ✨ **十干構造からの特性分析**（300文字以上の詳細分析）
  - ✨ **算命学的資質**（十大主星、十二大従星、天中殺など、300文字以上）
  - ✨ **演者タイプ**（例：「知的探求者型」「エンターテイナー型」など）
  - ✨ **世界観コンセプト提案**（キーワード、ビジュアルディレクション、カラー哲学、コンテンツ戦略）
  - ✨ **総合分析レポート**（500文字以上の詳細レポート）
- **画像生成**：Pollinations AI（無料）を使用して実際の画像を生成します

### 3. 分析実行

「分析開始」ボタンをクリックすると、約10秒で結果が表示されます。

### 4. レポート確認

以下の情報が表示されます：

- **鑑定分析結果**: 四柱、五行バランス、性格特性
- **✨ Gemini AI詳細鑑定分析**（APIキー提供時）:
  - 基本命式の解説
  - 十干構造からの特性分析
  - 算命学的資質
  - 演者タイプ
  - AI生成の世界観コンセプト提案（キーワード、ビジュアルディレクション、カラー哲学、コンテンツ戦略）
  - 総合分析レポート
- **世界観コンセプト**: テーマ、カラーパレット、推奨事項
- **サンプル画像**: 撮影イメージ、サムネイル（プレースホルダー）

## サンプル: nanobanana分析

### 入力例

```
名前: nanobanana
生年月日: 1998年7月15日
出生時刻: 14:30
性別: 女性
ジャンル: VLOG
ターゲット: 20代女性
```

### 期待される出力

- **テーマ**: "ナチュラル・エレガンス"
- **カラーパレット**: ウォームベージュ (#E8D5C4), ダスティローズ, セージグリーン
- **ビジュアルスタイル**: ミニマル × ナチュラル
- **ムード**: 落ち着いた、温かみのある、洗練された

## プロジェクト構造

```
youtube-worldview-creator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # APIルート
│   │   │   └── analyze/       # 分析エンドポイント
│   │   ├── page.tsx           # ホーム画面
│   │   ├── layout.tsx         # ルートレイアウト
│   │   └── globals.css        # グローバルスタイル
│   ├── engines/               # 分析エンジン
│   │   └── four-pillars/      # 四柱推命エンジン
│   │       ├── calendar.ts    # 干支カレンダー計算
│   │       ├── constants.ts   # 十干・十二支・五行定義
│   │       ├── five-elements.ts
│   │       ├── personality-traits.ts
│   │       ├── color-affinity.ts
│   │       └── index.ts
│   ├── generators/            # 生成エンジン
│   │   └── world-view/        # 世界観生成エンジン
│   │       └── index.ts
│   └── lib/                   # ライブラリ
│       ├── prisma.ts          # Prismaクライアント
│       └── gemini-client.ts   # Gemini APIクライアント
├── prisma/
│   └── schema.prisma          # データベーススキーマ
├── docs/                      # ドキュメント
│   ├── youtube-worldview-tool-requirements.md
│   ├── youtube-worldview-tool-architecture.md
│   └── ...
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 開発

### ビルド

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### テスト（今後実装予定）

```bash
npm test
```

## 重要な注意事項

### 画像生成について

このアプリケーションは **Pollinations AI** を使用して実際の画像を生成します。

- **Pollinations AI**: 無料で使用できる画像生成サービス
- **画像の種類**:
  - 撮影イメージ画像（16:9、1920x1080）- YouTubeスタジオのリアルな撮影環境
  - サムネイル画像（16:9、1280x720）- YouTubeサムネイル用の目を引くデザイン
- **特徴**:
  - Flux モデルを使用した高品質な画像生成
  - プロフェッショナルな実写スタイル
  - Gemini AIの鑑定結果に基づいたカスタマイズされたプロンプト

画像生成のロジックは `src/lib/gemini-client.ts:generateShootingImage()` および `generateThumbnailImage()` で実装されています。

### データベースについて

Prismaスキーマは実装済みですが、現在の簡易版ではデータベース接続なしでも動作します。

データベースを使用する場合は、PostgreSQLをセットアップして`.env.local`に接続文字列を設定してください。

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com/)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ実行

### 環境変数（本番環境）

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

## トラブルシューティング

### データベース接続エラー

データベース機能を使用しない場合は、エラーを無視できます。分析機能は正常に動作します。

### 画像生成が動作しない

Gemini APIキーを確認してください。または、プレースホルダー画像が表示されます。

## ライセンス

MIT License

## 作成者

Claude Code (Miyabi Framework)

## 関連ドキュメント

- [要件定義書](./docs/youtube-worldview-tool-requirements.md)
- [システムアーキテクチャ](./docs/youtube-worldview-tool-architecture.md)
- [プロジェクト構造](./docs/youtube-worldview-tool-project-structure.md)
- [四柱推命ロジック](./docs/youtube-worldview-tool-fortune-logic.md)
- [UI/UXワイヤーフレーム](./docs/youtube-worldview-tool-ui-wireframes.md)

## サポート

質問やフィードバックは、GitHubのIssueで受け付けています。

---

**Happy Creating!** 🎨✨
