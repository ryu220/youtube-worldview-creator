/**
 * SEOキーワードからペルソナを分析するエンジン
 *
 * キーワードの裏にいる視聴者層を自動的に推定
 */

export interface PersonaAnalysisResult {
  keyword: string;
  primaryAudience: {
    ageRange: string;
    gender: string;
    interests: string[];
    painPoints: string[];
    goals: string[];
  };
  contentPreferences: {
    videoStyle: string;
    videoLength: string;
    toneOfVoice: string;
    topics: string[];
  };
  competitionLevel: 'low' | 'medium' | 'high';
  recommendedApproach: string;
}

/**
 * ペルソナ分析エンジン
 */
export class PersonaAnalyzer {
  /**
   * SEOキーワードからペルソナを分析
   */
  analyze(keyword: string): PersonaAnalysisResult {
    const lowerKeyword = keyword.toLowerCase().trim();

    // キーワードパターンマッチング
    const personaData = this.matchKeywordToPersona(lowerKeyword);

    return {
      keyword,
      ...personaData,
    };
  }

  /**
   * キーワードをペルソナデータにマッピング
   */
  private matchKeywordToPersona(keyword: string): Omit<PersonaAnalysisResult, 'keyword'> {
    // VLOG・日常系
    if (this.matchesPattern(keyword, ['vlog', '日常', 'ルーティン', '暮らし', 'ライフスタイル'])) {
      return {
        primaryAudience: {
          ageRange: '20-35歳',
          gender: '女性中心（70%）',
          interests: ['ライフスタイル', 'インテリア', 'ファッション', '美容'],
          painPoints: ['日々の生活がマンネリ化', '自分らしさを見つけたい', 'おしゃれな生活への憧れ'],
          goals: ['素敵な暮らしを送りたい', '自分磨きをしたい', 'リラックスしたい'],
        },
        contentPreferences: {
          videoStyle: 'ゆったり・癒し系',
          videoLength: '10-15分',
          toneOfVoice: '穏やか・共感的・親しみやすい',
          topics: ['モーニングルーティン', '購入品紹介', '部屋づくり', 'カフェ巡り'],
        },
        competitionLevel: 'high',
        recommendedApproach: '個性的なライフスタイルを前面に。視聴者との距離感を近く保ち、日常の小さな幸せを共有する。',
      };
    }

    // ゲーム実況系
    if (this.matchesPattern(keyword, ['ゲーム', '実況', 'ゲーム実況', 'プレイ', 'gaming'])) {
      return {
        primaryAudience: {
          ageRange: '15-30歳',
          gender: '男性中心（65%）',
          interests: ['ゲーム', 'eスポーツ', 'アニメ', 'テクノロジー'],
          painPoints: ['暇つぶしコンテンツが欲しい', '上達したい', '仲間が欲しい'],
          goals: ['楽しく時間を過ごしたい', 'ゲームスキルを向上させたい', 'コミュニティに参加したい'],
        },
        contentPreferences: {
          videoStyle: 'エンターテイメント・テンポ良く',
          videoLength: '15-30分',
          toneOfVoice: 'ハイテンション・リアクション豊か・ユーモア',
          topics: ['新作ゲーム実況', '神プレイ', 'やり込み企画', 'コラボ配信'],
        },
        competitionLevel: 'high',
        recommendedApproach: 'トークスキルと個性が重要。視聴者参加型企画やコミュニティ作りで差別化。',
      };
    }

    // 美容・コスメ系
    if (this.matchesPattern(keyword, ['美容', 'コスメ', 'メイク', 'スキンケア', 'beauty'])) {
      return {
        primaryAudience: {
          ageRange: '18-35歳',
          gender: '女性中心（90%）',
          interests: ['美容', 'ファッション', 'セルフケア', 'ライフスタイル'],
          painPoints: ['肌トラブル', 'メイクが上手くいかない', 'どの商品を選べばいいか分からない'],
          goals: ['きれいになりたい', '自分に合うコスメを見つけたい', 'メイク技術を上達させたい'],
        },
        contentPreferences: {
          videoStyle: '明るく・丁寧・ビフォーアフター重視',
          videoLength: '8-15分',
          toneOfVoice: '親しみやすい・説明が丁寧・共感的',
          topics: ['購入品レビュー', 'メイクチュートリアル', 'スキンケアルーティン', 'プチプラ vs デパコス'],
        },
        competitionLevel: 'high',
        recommendedApproach: '正直なレビューと実用的なテクニック。視聴者の肌タイプや予算に合わせた提案が鍵。',
      };
    }

    // 料理・グルメ系
    if (this.matchesPattern(keyword, ['料理', 'グルメ', 'レシピ', '食べ歩き', 'cooking', '飯テロ'])) {
      return {
        primaryAudience: {
          ageRange: '25-45歳',
          gender: '女性やや多め（60%）',
          interests: ['料理', 'グルメ', '健康', 'ライフスタイル'],
          painPoints: ['料理のレパートリーが少ない', '時間がない', '美味しいお店を見つけたい'],
          goals: ['料理上手になりたい', '家族を喜ばせたい', '美味しいものを食べたい'],
        },
        contentPreferences: {
          videoStyle: '美味しそう・分かりやすい・実用的',
          videoLength: '5-12分',
          toneOfVoice: '優しい・親切・食欲をそそる表現',
          topics: ['簡単レシピ', '時短料理', 'お店紹介', '大食い・デカ盛り'],
        },
        competitionLevel: 'medium',
        recommendedApproach: '見た目の美しさと実用性のバランス。初心者でも真似できるレシピと丁寧な説明。',
      };
    }

    // 教育・学習系
    if (this.matchesPattern(keyword, ['教育', '学習', '勉強', '資格', '英語', 'education', 'study'])) {
      return {
        primaryAudience: {
          ageRange: '15-35歳',
          gender: 'バランス型（男女半々）',
          interests: ['自己啓発', 'キャリア', '資格取得', 'スキルアップ'],
          painPoints: ['勉強が続かない', '効率的な学習法が分からない', '時間がない'],
          goals: ['試験に合格したい', 'スキルを身につけたい', 'キャリアアップしたい'],
        },
        contentPreferences: {
          videoStyle: '分かりやすい・論理的・実践的',
          videoLength: '10-20分',
          toneOfVoice: '説明が明確・励まし的・専門的すぎない',
          topics: ['効率的勉強法', '試験対策', 'モチベーション維持', '実践テクニック'],
        },
        competitionLevel: 'medium',
        recommendedApproach: '実績と信頼性の提示。段階的で分かりやすい説明。視聴者の成功体験を促す。',
      };
    }

    // エンタメ系
    if (this.matchesPattern(keyword, ['エンタメ', 'バラエティ', 'ドッキリ', 'チャレンジ', 'entertainment'])) {
      return {
        primaryAudience: {
          ageRange: '15-30歳',
          gender: 'やや男性多め（55%）',
          interests: ['エンターテイメント', 'お笑い', 'トレンド', 'SNS'],
          painPoints: ['暇つぶしが欲しい', '笑いたい', 'ストレス発散したい'],
          goals: ['楽しく時間を過ごしたい', '笑いたい', '話のネタが欲しい'],
        },
        contentPreferences: {
          videoStyle: 'ハイテンション・テンポ良い・サムネ重視',
          videoLength: '8-15分',
          toneOfVoice: '明るい・ユーモラス・リアクション豊か',
          topics: ['ドッキリ', 'チャレンジ企画', 'コラボ', 'トレンド参加'],
        },
        competitionLevel: 'high',
        recommendedApproach: 'アイデアの独自性と企画力。仲間との掛け合いやキャラクター性で差別化。',
      };
    }

    // デフォルト（汎用ペルソナ）
    return {
      primaryAudience: {
        ageRange: '20-40歳',
        gender: 'バランス型',
        interests: [keyword, '情報収集', 'ライフスタイル'],
        painPoints: ['情報が欲しい', '解決策を探している', '時間がない'],
        goals: ['問題を解決したい', '知識を得たい', '楽しみたい'],
      },
      contentPreferences: {
        videoStyle: '分かりやすい・実用的',
        videoLength: '10-15分',
        toneOfVoice: '親しみやすい・丁寧',
        topics: [keyword + 'の基礎', keyword + 'のコツ', keyword + 'の最新情報'],
      },
      competitionLevel: 'medium',
      recommendedApproach: 'キーワードの専門性を活かし、独自の視点や経験を提供する。',
    };
  }

  /**
   * キーワードパターンマッチング
   */
  private matchesPattern(keyword: string, patterns: string[]): boolean {
    return patterns.some(pattern => keyword.includes(pattern));
  }
}
