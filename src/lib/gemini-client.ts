/**
 * Gemini APIクライアント
 *
 * 注意: Gemini APIは現状テキスト生成に特化しており、直接的な画像生成機能は持っていません。
 * 実際の運用では、Stable Diffusion API、DALL-E API、または他の画像生成サービスを使用してください。
 *
 * このクライアントは、画像生成プロンプトの生成とダミーレスポンスを返します。
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: '16:9' | '1:1' | '1280:720';
  quality?: 'standard' | 'hd';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
  timestamp: string;
}

import type { PersonaAnalysisResult } from '@/analyzers/persona';
import type { PositioningAnalysisResult } from '@/analyzers/positioning';

export interface GeminiAppraisalRequest {
  name: string;
  birthDate: string;
  gender: string;
  seoKeyword: string;
  performerAge: number;
  fourPillars: {
    year: { stem: string; branch: string; element: string; yinYang: string };
    month: { stem: string; branch: string; element: string; yinYang: string };
    day: { stem: string; branch: string; element: string; yinYang: string };
    hour: { stem: string; branch: string; element: string; yinYang: string };
  };
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    dominant: string;
    weak: string;
  };
  personality: {
    traits: string[];
  };
  personaAnalysis?: PersonaAnalysisResult;
  positioningAnalysis?: PositioningAnalysisResult;
}

export interface GeminiAppraisalResponse {
  yourEssence: string;
  personality: string;
  talents: string;
  performerType: string;
  worldviewConcept: {
    keywords: string[];
    visualDirection: string;
    colorPhilosophy: string;
    contentStrategy: string;
  };
  detailedAnalysis: string;
}

export class GeminiClient {
  private apiKey: string;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Gemini 2.5 Proを使用した詳細な鑑定分析
   */
  async analyzeWithGemini25Pro(request: GeminiAppraisalRequest): Promise<GeminiAppraisalResponse> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
あなたは優しい占い師として、YouTubeクリエイターの個性や才能を分かりやすく説明してください。

**重要**:
- 専門用語は一切使わず、中学生でも理解できる言葉で説明してください
- 親しみやすく、前向きな表現を心がけてください
- 例え話を使って分かりやすく伝えてください

# ${request.name}さんについて
- お名前: ${request.name}
- 生年月日: ${request.birthDate}
- 年齢: ${request.performerAge}歳
- 性別: ${request.gender}
- SEOキーワード（狙っているジャンル）: ${request.seoKeyword}
- 最適な視聴者層: ${request.performerAge - 10}〜${request.performerAge + 10}歳（演者の年齢±10歳が最も共感を得やすい層です）

${request.personaAnalysis ? `
# 「${request.seoKeyword}」に関心のある視聴者層の特徴
- 想定年齢層: ${request.personaAnalysis.primaryAudience.ageRange}
- 性別比率: ${request.personaAnalysis.primaryAudience.gender}
- 興味関心: ${request.personaAnalysis.primaryAudience.interests.join('、')}
- 悩み・課題: ${request.personaAnalysis.primaryAudience.painPoints.join('、')}
- 視聴目的: ${request.personaAnalysis.primaryAudience.goals.join('、')}
- 好む動画スタイル: ${request.personaAnalysis.contentPreferences.videoStyle}
- 競合レベル: ${request.personaAnalysis.competitionLevel === 'high' ? '激戦区' : request.personaAnalysis.competitionLevel === 'medium' ? '中程度' : '比較的穴場'}
` : ''}

${request.positioningAnalysis ? `
# あなたの独自ポジショニング戦略
- 独自性スコア: ${request.positioningAnalysis.uniquenessScore}/100点（高いほど差別化された独自のポジション）
- ポジショニングタイプ: ${
  request.positioningAnalysis.positioningType === 'mainstream' ? '王道スタイル - 共感と親近感で勝負' :
  request.positioningAnalysis.positioningType === 'differentiated' ? '差別化スタイル - 独自の視点と経験で勝負' :
  request.positioningAnalysis.positioningType === 'niche' ? 'ニッチスタイル - 希少性と専門性で勝負' :
  '革命的スタイル - 常識を覆す新カテゴリー創出'
}
- あなたの自然体な視聴者層: ${request.positioningAnalysis.performerOptimalRange}
- ジャンルの典型的視聴者層: ${request.positioningAnalysis.personaTargetRange}

## あなたの強みとチャンス
${request.positioningAnalysis.opportunities.map(o => `${o}`).join('\n')}

## 戦略的アプローチ
- ${request.positioningAnalysis.positioningStrategy.approach}
- 強みポイント: ${request.positioningAnalysis.positioningStrategy.strengthPoints.join('、')}
- 差別化ポイント: ${request.positioningAnalysis.positioningStrategy.differentiators.join('、')}
` : ''}

# 生まれ持った5つの性質（エネルギー）
- 木のエネルギー（成長する力・新しいアイデア）: ${request.fiveElements.wood.toFixed(1)}点
- 火のエネルギー（情熱・明るさ）: ${request.fiveElements.fire.toFixed(1)}点
- 土のエネルギー（安定感・温かさ）: ${request.fiveElements.earth.toFixed(1)}点
- 金のエネルギー（しっかりした考え・正確さ）: ${request.fiveElements.metal.toFixed(1)}点
- 水のエネルギー（頭の良さ・柔軟性）: ${request.fiveElements.water.toFixed(1)}点

**あなたの特徴**: ${request.fiveElements.dominant}のエネルギーが一番強い人です

---

# どのように説明してほしいか

以下の例のように、分かりやすく親しみやすい言葉で説明してください。

## 【良い例】

### あなたの本質
「${request.fiveElements.dominant}」のエネルギーが強いあなたは、まるで○○のような人です。
（例え話を使って、その人の性格や特徴を説明する）

### あなたの性格・才能
- こんな長所があります：○○、△△、□□
- こんな時に輝きます：○○な場面
- 注意したいこと：○○に気をつけると良いでしょう

### YouTubeでのあなたのタイプ
あなたは「○○型」のクリエイターです。
（視聴者に何を届けたいか、どんなスタイルが合うかを説明）

### チャンネルづくりのヒント
**テーマとなるキーワード**:
1. ○○（簡単な説明）
2. △△（簡単な説明）
3. □□（簡単な説明）

**映像の雰囲気**:
（どんな色使い、撮影スタイルが合うかを具体的に）

**おすすめの動画企画**:
- ○○な動画
- △△シリーズ
- □□企画

### 総合アドバイス
（強みを活かすためのアドバイス、気をつけたいポイント、長期的な成功のためのヒントを分かりやすく）

---

# 回答形式

${request.name}さんの分析を、以下のJSON形式で回答してください：

\`\`\`json
{
  "yourEssence": "あなたの本質を例え話を使って分かりやすく説明（200文字以上）",
  "personality": "性格や才能について、長所と短所を分かりやすく説明（200文字以上）",
  "talents": "YouTubeで活かせる才能や強みを具体的に説明（200文字以上）",
  "performerType": "クリエイタータイプ（例：「教えるのが得意な先生タイプ」「盛り上げ上手なエンターテイナータイプ」など）",
  "worldviewConcept": {
    "keywords": ["分かりやすいキーワード1", "分かりやすいキーワード2", "分かりやすいキーワード3"],
    "visualDirection": "どんな映像の雰囲気が合うか、具体的に分かりやすく説明（200文字以上）",
    "colorPhilosophy": "おすすめの色使いを、なぜその色が合うのか理由と一緒に説明。HEXコード3色以上を含める（200文字以上）",
    "contentStrategy": "おすすめの動画企画を3つ以上、具体的に提案（200文字以上）"
  },
  "detailedAnalysis": "総合的なアドバイスを、前向きで分かりやすい言葉で説明（500文字以上）。専門用語は使わない"
}
\`\`\`
`;


    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // JSONを抽出
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      let jsonText = jsonMatch ? jsonMatch[1] : text;

      // 制御文字をクリーンアップ（改行、タブ、バックスペースなど）
      jsonText = jsonText
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, (char) => {
          // 改行とタブは保持
          if (char === '\n' || char === '\t') {
            return char;
          }
          // その他の制御文字は削除
          return '';
        });

      // JSONとしてパース
      const analysisData = JSON.parse(jsonText);
      return analysisData;
    } catch (error) {
      console.error('Gemini 2.5 Pro analysis error:', error);
      throw new GeminiError(
        'Gemini 2.5 Proによる分析に失敗しました',
        'GEMINI_ANALYSIS_ERROR',
        true
      );
    }
  }

  /**
   * 画像生成プロンプトを最適化
   */
  private optimizePrompt(prompt: string, aspectRatio: string): string {
    const aspectRatioInstructions = {
      '16:9': 'ASPECT RATIO: Wide horizontal format 16:9, cinematic widescreen composition, landscape orientation, 1920x1080 resolution',
      '1:1': 'ASPECT RATIO: Square format 1:1, balanced centered composition, 1080x1080 resolution',
      '1280:720': 'ASPECT RATIO: YouTube thumbnail format 16:9, 1280x720 pixels exactly, optimized for YouTube display',
    };

    return `${prompt}

${aspectRatioInstructions[aspectRatio as keyof typeof aspectRatioInstructions]}

QUALITY REQUIREMENTS:
- Photorealistic, ultra high quality
- Professional photography standards
- Sharp focus, proper exposure
- Natural skin tones and colors
- Professional color grading
- No artifacts or distortions
- Clean, crisp details`;
  }

  /**
   * 撮影イメージ画像を生成（Gemini 2.5 Flash Image使用）
   */
  async generateShootingImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const optimizedPrompt = this.optimizePrompt(
      request.prompt,
      request.aspectRatio || '16:9'
    );

    try {
      // Gemini 2.5 Flash Imageモデルを使用
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

      const result = await model.generateContent([optimizedPrompt]);
      const response = await result.response;

      // 画像データを取得
      const imageData = response.candidates?.[0]?.content?.parts?.[0];

      if (imageData && 'inlineData' in imageData && imageData.inlineData) {
        // Base64エンコードされた画像をData URLに変換
        const base64Image = imageData.inlineData.data;
        const mimeType = imageData.inlineData.mimeType || 'image/png';
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        return {
          imageUrl,
          prompt: optimizedPrompt,
          timestamp: new Date().toISOString(),
        };
      }

      throw new Error('画像生成に失敗しました');
    } catch (error) {
      console.error('Gemini image generation error:', error);
      throw new GeminiError(
        'Gemini 2.5 Flash Imageによる画像生成に失敗しました',
        'GEMINI_IMAGE_GENERATION_ERROR',
        true
      );
    }
  }

  /**
   * サムネイル画像を生成（Gemini 2.5 Flash Image使用）
   */
  async generateThumbnailImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const optimizedPrompt = this.optimizePrompt(
      request.prompt,
      request.aspectRatio || '1280:720'
    );

    try {
      // Gemini 2.5 Flash Imageモデルを使用
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

      const result = await model.generateContent([optimizedPrompt]);
      const response = await result.response;

      // 画像データを取得
      const imageData = response.candidates?.[0]?.content?.parts?.[0];

      if (imageData && 'inlineData' in imageData && imageData.inlineData) {
        // Base64エンコードされた画像をData URLに変換
        const base64Image = imageData.inlineData.data;
        const mimeType = imageData.inlineData.mimeType || 'image/png';
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        return {
          imageUrl,
          prompt: optimizedPrompt,
          timestamp: new Date().toISOString(),
        };
      }

      throw new Error('画像生成に失敗しました');
    } catch (error) {
      console.error('Gemini image generation error:', error);
      throw new GeminiError(
        'Gemini 2.5 Flash Imageによる画像生成に失敗しました',
        'GEMINI_IMAGE_GENERATION_ERROR',
        true
      );
    }
  }

  /**
   * プロンプト生成: 撮影イメージ用（実写ベース）
   */
  static generateShootingPrompt(input: {
    gender: string;
    traits: string[];
    theme: string;
    colorPalette: { main: string; accent: string[] };
    visualStyle: string;
    mood: string;
  }): string {
    const { gender, traits, theme, colorPalette, visualStyle, mood } = input;

    const genderMap: Record<string, string> = {
      男性: 'a young Japanese male YouTuber in his 20s-30s',
      女性: 'a young Japanese female YouTuber in her 20s-30s',
      その他: 'a young Japanese YouTuber in their 20s-30s',
    };

    const genderDesc = genderMap[gender] || 'a young Japanese YouTuber';

    return `Create a professional, photorealistic YouTube studio setup featuring ${genderDesc}.

SUBJECT:
- ${genderDesc} sitting comfortably in a modern ergonomic chair
- Dressed in casual but stylish clothing that reflects: ${traits.slice(0, 3).join(', ')}
- Natural, friendly expression, looking directly at camera
- Professional posture, engaged and approachable

STUDIO SETUP:
- Modern YouTube content creation studio
- Theme: ${theme}
- Visual style: ${visualStyle}
- Mood: ${mood}

COLOR SCHEME:
- Primary color: ${colorPalette.main} (use in background elements, lighting, decorations)
- Accent colors: ${colorPalette.accent.join(', ')} (subtle highlights, props, LED lights)
- Harmonious balance between all colors

BACKGROUND:
- Clean, well-organized, professional but personalized
- Shelves with books, plants, or hobby items
- LED strip lights with colors matching the palette
- Framed artwork or posters related to content theme
- Depth of field effect (subject sharp, background slightly blurred)

LIGHTING:
- Professional three-point lighting setup
- Soft key light on subject's face
- Rim light creating subtle edge lighting
- Ambient colored lighting matching the color palette

TECHNICAL:
- Shot with high-end camera (Canon EOS R5, Sony A7IV level)
- 50mm or 85mm portrait lens
- Shallow depth of field (f/2.8 - f/4)
- Photorealistic, high resolution, 8K quality
- Cinematic color grading
- Professional YouTube studio aesthetic

COMPOSITION:
- Rule of thirds composition
- Subject positioned slightly off-center
- Engaging eye contact with camera
- Natural, relaxed body language

Style: Professional YouTube content creator portrait, trending on YouTube 2024, studio photography`;
  }

  /**
   * プロンプト生成: サムネイル用（実写ベース）
   */
  static generateThumbnailPrompt(input: {
    gender: string;
    seoKeyword: string;
    theme: string;
    mainColor: string;
    accentColors: string[];
    typography: string;
  }): string {
    const { gender, seoKeyword, theme, mainColor, accentColors, typography } = input;

    const genderMap: Record<string, string> = {
      男性: 'a young Japanese male YouTuber in his 20s-30s',
      女性: 'a young Japanese female YouTuber in her 20s-30s',
      その他: 'a young Japanese YouTuber in their 20s-30s',
    };

    const genderDesc = genderMap[gender] || 'a young Japanese YouTuber';

    return `Create a professional, eye-catching YouTube thumbnail for a ${seoKeyword} video.

SUBJECT:
- ${genderDesc} as the main focal point
- Expressive facial expression showing emotion (excited, surprised, thoughtful, friendly)
- Looking at camera with engaging eye contact
- Positioned on the left or right side (leaving space for text)
- Professional but relatable appearance
- Dramatic lighting highlighting the face

COMPOSITION:
- 1280x720 pixels, 16:9 aspect ratio
- Rule of thirds composition
- Clear foreground (subject) and background separation
- Visual hierarchy: Subject → Text → Background elements

COLOR SCHEME:
- Primary color: ${mainColor} (dominant in background or lighting)
- Accent colors: ${accentColors.join(', ')} (text, highlights, graphic elements)
- High contrast for readability
- Vibrant but not oversaturated
- Professional color grading

TEXT ELEMENTS:
- Large, bold Japanese text: "注目の動画タイトル"
- Typography style: ${typography}
- Text with stroke/outline for readability
- Positioned in negative space
- Font size: 80-120pt
- Maximum 2-3 lines of text

BACKGROUND:
- Theme: ${theme}
- Slightly blurred or simplified (subject stands out)
- Complementary to main subject
- Related to ${seoKeyword} theme
- Professional, clean aesthetic

LIGHTING:
- Dramatic studio lighting
- Rim lighting creating separation from background
- Colored gels matching the palette
- High contrast, professional grade

VISUAL EFFECTS:
- Subtle glow or rim light on subject
- Color grading matching the palette
- Sharp focus on subject's face
- Slightly blurred background (depth of field)
- Professional thumbnail aesthetic

STYLE REFERENCES:
- Trending YouTube thumbnails 2024
- ${seoKeyword} theme best practices
- High click-through rate design
- Professional content creator style
- Photorealistic, high quality

TECHNICAL:
- Photorealistic rendering
- High resolution (1280x720 minimum)
- Web-optimized colors (sRGB)
- Text clearly readable even at small sizes
- Eye-catching without being clickbait`;
  }
}

/**
 * エラーハンドリング用
 */
export class GeminiError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

/**
 * リトライ機能付きAPI呼び出し
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1 || !(error as GeminiError).retryable) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
