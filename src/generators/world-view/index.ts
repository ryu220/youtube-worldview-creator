import { FourPillarsAnalysisResult } from '@/engines/four-pillars';
import { Element } from '@/engines/four-pillars/constants';

export interface WorldViewConcept {
  theme: string;
  description: string;
  colorPalette: {
    main: {
      name: string;
      hex: string;
      usage: string;
    };
    accent: Array<{
      name: string;
      hex: string;
      usage: string;
    }>;
    base: Array<{
      name: string;
      hex: string;
      usage: string;
    }>;
  };
  toneAndManner: {
    visualStyle: string;
    mood: string;
    typography: string;
  };
  recommendations: {
    thumbnailStyle: string;
    shootingStyle: string;
    editing: string;
  };
}

/**
 * 世界観生成エンジン
 */
export class WorldViewGenerator {
  /**
   * 四柱推命分析結果とジャンルから世界観コンセプトを生成
   */
  generate(input: {
    appraisal: FourPillarsAnalysisResult;
    genre: string;
    targetAge: string;
    targetGender: string;
  }): WorldViewConcept {
    const { appraisal, genre, targetAge, targetGender } = input;
    const dominantElement = appraisal.fiveElements.dominant;

    // テーマ生成
    const theme = this.generateTheme(dominantElement, genre);

    // 説明文生成
    const description = this.generateDescription(appraisal, genre, targetAge);

    // カラーパレット生成
    const colorPalette = this.generateDetailedColorPalette(
      appraisal.colorPalette,
      dominantElement
    );

    // トーン&マナー生成
    const toneAndManner = this.generateToneAndManner(dominantElement, genre, targetAge);

    // 推奨事項生成
    const recommendations = this.generateRecommendations(dominantElement, genre, targetGender);

    return {
      theme,
      description,
      colorPalette,
      toneAndManner,
      recommendations,
    };
  }

  /**
   * テーマ生成
   */
  private generateTheme(element: Element, genre: string): string {
    const elementThemes: Record<Element, string[]> = {
      木: ['ナチュラル・グロース', 'フレッシュ・クリエイティブ', 'グリーン・イノベーション'],
      火: ['パッション・エナジー', 'ダイナミック・パワー', 'ファイアー・スピリット'],
      土: ['ナチュラル・エレガンス', 'アーシー・コンフォート', 'ウォーム・ハーモニー'],
      金: ['クリスタル・クリア', 'シャープ・プレシジョン', 'エレガント・ミニマル'],
      水: ['フロー・インテリジェンス', 'ディープ・ブルー', 'アクア・フレキシビリティ'],
    };

    // ジャンルに応じたテーマ選択（簡易版）
    return elementThemes[element][0];
  }

  /**
   * 説明文生成
   */
  private generateDescription(
    appraisal: FourPillarsAnalysisResult,
    genre: string,
    targetAge: string
  ): string {
    const traits = appraisal.personality.traits.slice(0, 3).join('」「');
    const element = appraisal.fiveElements.dominant;

    const elementDescriptions: Record<Element, string> = {
      木: 'あなたの本質的な「成長志向」「創造性」を活かし、視聴者に新鮮なインスピレーションを届ける世界観です。',
      火: 'あなたの本質的な「情熱」「エネルギー」を活かし、視聴者を惹きつける力強い世界観です。',
      土: `あなたの本質的な「${traits}」を活かし、視聴者に安心感と温かみを届ける世界観です。`,
      金: 'あなたの本質的な「論理性」「正確性」を活かし、視聴者に信頼感を与える洗練された世界観です。',
      水: 'あなたの本質的な「知性」「柔軟性」を活かし、視聴者に深い共感を呼ぶ世界観です。',
    };

    return `${elementDescriptions[element]} ${targetAge}の視聴者の共感を呼び、長期的なファンを獲得できるコンセプトです。`;
  }

  /**
   * 詳細カラーパレット生成
   */
  private generateDetailedColorPalette(
    basePalette: { main: string; accent: string[]; base: string[] },
    element: Element
  ): WorldViewConcept['colorPalette'] {
    const colorNames: Record<Element, { main: string; accent: string[]; base: string[] }> = {
      木: {
        main: 'フレッシュグリーン',
        accent: ['ライムグリーン', 'イエロー'],
        base: ['ホワイト', 'ライトグリーン', 'アイボリー'],
      },
      火: {
        main: 'パッションオレンジ',
        accent: ['ファイアレッド', 'イエロー'],
        base: ['ホワイト', 'ライトオレンジ', 'ライトピンク'],
      },
      土: {
        main: 'ウォームベージュ',
        accent: ['ダスティローズ', 'セージグリーン'],
        base: ['アイボリー', 'ライトグレー'],
      },
      金: {
        main: 'ブルーグレー',
        accent: ['シルバーグレー', 'チャコール'],
        base: ['ホワイト', 'ライトグレー', 'ペールブルー'],
      },
      水: {
        main: 'ディープブルー',
        accent: ['スカイブルー', 'シアン'],
        base: ['ホワイト', 'ライトブルー', 'ペールシアン'],
      },
    };

    return {
      main: {
        name: colorNames[element].main,
        hex: basePalette.main,
        usage: 'サムネイル背景、全体のトーン',
      },
      accent: basePalette.accent.map((hex, index) => ({
        name: colorNames[element].accent[index] || `アクセント${index + 1}`,
        hex,
        usage: index === 0 ? 'テキスト強調、CTA' : '装飾、アイコン',
      })),
      base: basePalette.base.map((hex, index) => ({
        name: colorNames[element].base[index] || `ベース${index + 1}`,
        hex,
        usage: index === 0 ? '背景メイン' : '背景サブ、余白',
      })),
    };
  }

  /**
   * トーン&マナー生成
   */
  private generateToneAndManner(
    element: Element,
    genre: string,
    targetAge: string
  ): WorldViewConcept['toneAndManner'] {
    const elementStyles: Record<Element, { visualStyle: string; mood: string; typography: string }> = {
      木: {
        visualStyle: 'ナチュラル × モダン',
        mood: '爽やか、フレッシュ、成長志向',
        typography: 'Noto Sans JP (Regular)',
      },
      火: {
        visualStyle: 'ダイナミック × ボールド',
        mood: '情熱的、エネルギッシュ、刺激的',
        typography: 'Noto Sans JP (Bold)',
      },
      土: {
        visualStyle: 'ミニマル × ナチュラル',
        mood: '落ち着いた、温かみのある、洗練された',
        typography: 'Noto Sans JP (Medium)',
      },
      金: {
        visualStyle: 'エレガント × ミニマル',
        mood: '洗練された、クリア、上質',
        typography: 'Noto Sans JP (Light)',
      },
      水: {
        visualStyle: 'フロー × インテリジェント',
        mood: '知的、柔軟、深い',
        typography: 'Noto Serif JP (Regular)',
      },
    };

    return elementStyles[element];
  }

  /**
   * 推奨事項生成
   */
  private generateRecommendations(
    element: Element,
    genre: string,
    targetGender: string
  ): WorldViewConcept['recommendations'] {
    const elementRecommendations: Record<Element, WorldViewConcept['recommendations']> = {
      木: {
        shootingStyle: '自然光を活用した明るい撮影。観葉植物など自然要素を背景に配置。',
        editing: 'ソフトなトランジション、明るく爽やかなBGM、テロップは控えめに。',
        thumbnailStyle: '明るい背景、笑顔の表情、グリーン系のアクセント。',
      },
      火: {
        shootingStyle: '強い照明で力強さを演出。動的なカメラワーク。',
        editing: 'クイックカット、アップテンポなBGM、大胆なテロップ。',
        thumbnailStyle: '高コントラスト、力強い表情、赤・オレンジ系のアクセント。',
      },
      土: {
        shootingStyle: '自然光を活用した明るい撮影。シンプルで清潔感のあるセット。',
        editing: 'ソフトなトランジション、落ち着いたBGM、テロップは控えめに。',
        thumbnailStyle: '顔のアップ + 明るい笑顔、ベージュ系背景、テキストは大きく読みやすく。',
      },
      金: {
        shootingStyle: 'クリアな照明、整理されたミニマルなセット。',
        editing: 'シャープなカット、洗練されたBGM、テロップは最小限。',
        thumbnailStyle: 'シンプルな背景、知的な表情、グレー・白系のトーン。',
      },
      水: {
        shootingStyle: '柔らかい照明、流動的なカメラワーク。',
        editing: 'スムーズなトランジション、知的なBGM、説明的なテロップ。',
        thumbnailStyle: '落ち着いた背景、考え込む表情、青系のアクセント。',
      },
    };

    return elementRecommendations[element];
  }
}
