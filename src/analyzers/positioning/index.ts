/**
 * 演者×ジャンルの独自ポジショニング分析エンジン
 *
 * どんな組み合わせでも、その人が最も魅力的に見える世界観を提案
 * 年齢ギャップや個性の違いを「強み」として活かす戦略を提示
 */

import { PersonaAnalysisResult } from '@/analyzers/persona';

export interface PositioningAnalysisResult {
  uniquenessScore: number; // 0-100の独自性スコア（高い=差別化されたポジション、低い=王道ポジション）
  positioningType: 'mainstream' | 'differentiated' | 'niche' | 'revolutionary';
  performerOptimalRange: string; // 演者の自然体な視聴者層（年齢±10）
  personaTargetRange: string; // ジャンルの典型的視聴者層
  positioningStrategy: {
    approach: string; // メインアプローチ
    strengthPoints: string[]; // この組み合わせの強み
    differentiators: string[]; // 差別化ポイント
  };
  opportunities: string[]; // チャンスと可能性（従来のwarningsに相当）
  recommendations: string[]; // 具体的な世界観提案
}

/**
 * 独自ポジショニング分析エンジン
 */
export class UniquePositioningAnalyzer {
  /**
   * 演者年齢とペルソナから最適なポジショニング戦略を分析
   */
  analyze(performerAge: number, personaAnalysis: PersonaAnalysisResult): PositioningAnalysisResult {
    // 演者の自然体な視聴者層（±10歳理論）
    const performerMinAge = performerAge - 10;
    const performerMaxAge = performerAge + 10;
    const performerOptimalRange = `${performerMinAge}〜${performerMaxAge}歳`;

    // ペルソナの想定視聴者層を解析
    const personaTargetRange = personaAnalysis.primaryAudience.ageRange;
    const { minAge: personaMinAge, maxAge: personaMaxAge } = this.parseAgeRange(personaTargetRange);

    // 重複範囲を計算
    const overlapMinAge = Math.max(performerMinAge, personaMinAge);
    const overlapMaxAge = Math.min(performerMaxAge, personaMaxAge);
    const hasOverlap = overlapMinAge <= overlapMaxAge;

    // 独自性スコアを計算（0-100）
    // 王道に近い = 低スコア（0-40）、差別化されている = 高スコア（60-100）
    const uniquenessScore = this.calculateUniquenessScore(
      performerMinAge,
      performerMaxAge,
      personaMinAge,
      personaMaxAge,
      hasOverlap,
      overlapMinAge,
      overlapMaxAge
    );

    // ポジショニングタイプを判定
    const positioningType = this.determinePositioningType(uniquenessScore, hasOverlap);

    // ポジショニング戦略を生成
    const positioningStrategy = this.generatePositioningStrategy(
      performerAge,
      personaMinAge,
      personaMaxAge,
      uniquenessScore,
      positioningType,
      personaAnalysis
    );

    // チャンス・可能性を生成
    const opportunities = this.generateOpportunities(
      performerAge,
      personaMinAge,
      personaMaxAge,
      hasOverlap,
      uniquenessScore,
      personaAnalysis
    );

    // 具体的な推奨事項を生成
    const recommendations = this.generateRecommendations(
      performerAge,
      personaMinAge,
      personaMaxAge,
      uniquenessScore,
      positioningType,
      personaAnalysis
    );

    return {
      uniquenessScore,
      positioningType,
      performerOptimalRange,
      personaTargetRange,
      positioningStrategy,
      opportunities,
      recommendations,
    };
  }

  /**
   * 年齢範囲文字列を解析（例: "20-35歳" → {minAge: 20, maxAge: 35}）
   */
  private parseAgeRange(range: string): { minAge: number; maxAge: number } {
    // パターン: "20-35歳" or "20〜35歳"
    const match = range.match(/(\d+)[-〜~](\d+)/);
    if (match) {
      return {
        minAge: parseInt(match[1], 10),
        maxAge: parseInt(match[2], 10),
      };
    }

    // デフォルト（解析失敗時）
    return { minAge: 20, maxAge: 40 };
  }

  /**
   * 独自性スコアを計算（0-100）
   * 王道・定番 = 低スコア、差別化・ニッチ = 高スコア
   */
  private calculateUniquenessScore(
    performerMin: number,
    performerMax: number,
    personaMin: number,
    personaMax: number,
    hasOverlap: boolean,
    overlapMin: number,
    overlapMax: number
  ): number {
    if (!hasOverlap) {
      // 重複なし → 超差別化ポジション（高スコア）
      return 85;
    }

    // 重複範囲の広さ
    const overlapRange = overlapMax - overlapMin;
    const performerRange = performerMax - performerMin; // 通常20歳
    const personaRange = personaMax - personaMin;

    // 重複率（演者の自然体範囲のうち、どれだけペルソナと重なっているか）
    const overlapRatioPerformer = overlapRange / performerRange;

    // 重複率（ペルソナの想定範囲のうち、どれだけ演者と重なっているか）
    const overlapRatioPersona = overlapRange / personaRange;

    // 両方の重複率の平均
    const averageOverlapRatio = (overlapRatioPerformer + overlapRatioPersona) / 2;

    // 独自性スコア = 100 - (重複率 × 100)
    // 完全一致 = スコア0（王道）、重複少ない = スコア高い（差別化）
    let score = 100 - (averageOverlapRatio * 100);

    // ペルソナの中心年齢と演者の年齢の差を加味
    const personaCenter = (personaMin + personaMax) / 2;
    const performerCenter = performerMin + 10;
    const ageDifference = Math.abs(performerCenter - personaCenter);

    if (ageDifference >= 15) {
      score += 15; // 大きなギャップ = 差別化ポテンシャル高い
    } else if (ageDifference >= 10) {
      score += 10;
    } else if (ageDifference >= 5) {
      score += 5;
    }

    // スコアを0-100に収める
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * ポジショニングタイプを判定
   */
  private determinePositioningType(
    score: number,
    hasOverlap: boolean
  ): 'mainstream' | 'differentiated' | 'niche' | 'revolutionary' {
    if (!hasOverlap) return 'revolutionary'; // 革命的ポジション
    if (score >= 60) return 'niche'; // ニッチ・独自
    if (score >= 30) return 'differentiated'; // 差別化
    return 'mainstream'; // 王道
  }

  /**
   * ポジショニング戦略を生成
   */
  private generatePositioningStrategy(
    performerAge: number,
    personaMin: number,
    personaMax: number,
    score: number,
    type: 'mainstream' | 'differentiated' | 'niche' | 'revolutionary',
    personaAnalysis: PersonaAnalysisResult
  ): { approach: string; strengthPoints: string[]; differentiators: string[] } {
    const strengthPoints: string[] = [];
    const differentiators: string[] = [];
    let approach = '';

    if (type === 'mainstream') {
      approach = '王道スタイル - 共感と親近感で勝負';
      strengthPoints.push('視聴者との年齢が近く、自然体で共感を得やすい');
      strengthPoints.push('同世代の悩みや関心事をリアルに理解できる');
      strengthPoints.push('トレンドや文化的背景を共有しやすい');
      differentiators.push('個性的なキャラクター性やトーク力で差別化');
      differentiators.push('独自の経験や視点を盛り込む');
      differentiators.push('コンテンツの質と一貫性で信頼を獲得');
    } else if (type === 'differentiated') {
      approach = '差別化スタイル - 独自の視点と経験で勝負';
      strengthPoints.push('視聴者とは異なる年齢ならではの視点を提供');
      strengthPoints.push('幅広い年齢層にアピールできるポテンシャル');

      if (performerAge < personaMin) {
        strengthPoints.push(`${performerAge}歳の若々しさとフレッシュな感性が強み`);
        differentiators.push('若者らしいエネルギーと新鮮な視点');
        differentiators.push('年上の視聴者に「若い世代の感覚」を届ける架け橋');
      } else {
        strengthPoints.push(`${performerAge}歳の豊富な経験と落ち着いた視点が強み`);
        differentiators.push('人生経験に基づく深い洞察と説得力');
        differentiators.push('若い視聴者に「大人の視点」を届けるメンター的存在');
      }

      differentiators.push('年齢の違いを個性として明確に打ち出す');
    } else if (type === 'niche') {
      approach = 'ニッチスタイル - 希少性と専門性で勝負';
      strengthPoints.push('このジャンルでは珍しい年齢層＝希少価値が高い');
      strengthPoints.push('競合が少ないポジションを確立できる');
      strengthPoints.push('意外性と新鮮さで注目を集めやすい');

      if (performerAge < personaMin) {
        differentiators.push(`「${performerAge}歳が${personaAnalysis.keyword}をやる意外性」を全面に`);
        differentiators.push('若者ならではの斬新なアプローチや解釈');
        differentiators.push('世代を超えた普遍性や新しい切り口を提示');
      } else {
        differentiators.push(`「${performerAge}歳が${personaAnalysis.keyword}をやる渋さ・深み」を強調`);
        differentiators.push('ベテランならではの視点や専門知識');
        differentiators.push('落ち着いた雰囲気と信頼感のある語り');
      }

      differentiators.push('ターゲット層以外の視聴者も取り込める可能性');
    } else {
      // revolutionary
      approach = '革命的スタイル - 常識を覆す新カテゴリー創出';
      strengthPoints.push('誰もやっていない全く新しいポジション');
      strengthPoints.push('既存の枠組みにとらわれない自由な表現');
      strengthPoints.push('パイオニアとして先行者利益を獲得できる');

      if (performerAge < personaMin - 10) {
        differentiators.push(`「まさかの${performerAge}歳」というサプライズ要素を最大限に活用`);
        differentiators.push('世代間ギャップを笑いや学びに変換するコンテンツ');
      } else if (performerAge > personaMax + 10) {
        differentiators.push(`「${performerAge}歳だからこそ」の説得力と重厚感`);
        differentiators.push('年齢を超えた情熱と挑戦を見せることで感動を生む');
      }

      differentiators.push('新しいジャンルやサブカルチャーを開拓');
      differentiators.push('「年齢は関係ない」というメッセージ性');
    }

    return {
      approach,
      strengthPoints,
      differentiators,
    };
  }

  /**
   * チャンス・可能性を生成
   */
  private generateOpportunities(
    performerAge: number,
    personaMin: number,
    personaMax: number,
    hasOverlap: boolean,
    uniquenessScore: number,
    personaAnalysis: PersonaAnalysisResult
  ): string[] {
    const opportunities: string[] = [];

    if (!hasOverlap) {
      if (performerAge + 10 < personaMin) {
        const gap = personaMin - (performerAge + 10);
        opportunities.push(`💡 想定視聴者より${gap}歳以上若い = 「若手の挑戦」として応援されやすい`);
        opportunities.push('✨ 年齢を超えた普遍的なテーマを扱うことで、幅広い層にアピール可能');
        opportunities.push('🎯 若者ならではの新しい解釈や切り口で、ジャンルに革新をもたらせる');
      } else if (performerAge - 10 > personaMax) {
        const gap = (performerAge - 10) - personaMax;
        opportunities.push(`💡 想定視聴者より${gap}歳以上年上 = 「ベテランの知見」として信頼を獲得しやすい`);
        opportunities.push('✨ 人生経験に裏打ちされた深い洞察で、差別化できる');
        opportunities.push('🎯 「大人が本気でやる」ギャップが、エンタメ性を生む');
      }
    } else if (uniquenessScore >= 50) {
      opportunities.push('💡 適度なギャップが「個性」として際立つ絶妙なポジション');
      opportunities.push('✨ ニッチな立ち位置で、熱狂的なファンを獲得しやすい');
    }

    // ジャンルの競合レベルに応じた機会
    if (personaAnalysis.competitionLevel === 'high') {
      opportunities.push(`🎯 ${personaAnalysis.keyword}は競合が多いが、あなたの年齢と個性で差別化しやすい`);
      opportunities.push('🌟 レッドオーシャンだからこそ、独自のポジショニングが光る');
    } else if (personaAnalysis.competitionLevel === 'medium') {
      opportunities.push('🎯 適度な競合環境で、質の高いコンテンツで頭角を現しやすい');
    } else {
      opportunities.push('🎯 競合が少ないブルーオーシャンで、先行者利益を獲得できる');
    }

    // 年齢を活かした機会
    if (performerAge < 25) {
      opportunities.push('✨ Z世代・若者としての感性とトレンド感度が武器になる');
    } else if (performerAge >= 25 && performerAge < 35) {
      opportunities.push('✨ 若さと経験のバランスが取れた、信頼される年齢層');
    } else if (performerAge >= 35 && performerAge < 50) {
      opportunities.push('✨ 豊富な人生経験と専門知識で、説得力のあるコンテンツを作れる');
    } else {
      opportunities.push('✨ 年齢を重ねたからこその深み・品格・ユーモアが強力な武器');
    }

    return opportunities;
  }

  /**
   * 推奨事項を生成
   */
  private generateRecommendations(
    performerAge: number,
    personaMin: number,
    personaMax: number,
    uniquenessScore: number,
    type: 'mainstream' | 'differentiated' | 'niche' | 'revolutionary',
    personaAnalysis: PersonaAnalysisResult
  ): string[] {
    const recommendations: string[] = [];

    if (type === 'mainstream') {
      recommendations.push('📌 同世代の共感を最大化: あなたの日常や経験をリアルに描く');
      recommendations.push(`📌 ${performerAge}歳ならではの「今」を切り取ったコンテンツ`);
      recommendations.push('📌 親しみやすさと一貫性を重視したキャラクター設計');
      recommendations.push('📌 トレンドを取り入れつつ、あなたらしさを忘れない');
    } else if (type === 'differentiated') {
      recommendations.push('📌 年齢の違いを「個性」として明確に打ち出す');

      if (performerAge < personaMin) {
        recommendations.push(`📌 「${performerAge}歳の視点」を前面に: フレッシュさ・新鮮さを強調`);
        recommendations.push('📌 年上の視聴者に対しては「後輩」「新世代」的なポジショニング');
      } else if (performerAge > personaMax) {
        recommendations.push(`📌 「${performerAge}歳だからこそ」の深み: 経験・知識・洞察を強調`);
        recommendations.push('📌 若い視聴者に対しては「先輩」「メンター」的なポジショニング');
      }

      recommendations.push(`📌 ${personaAnalysis.keyword}に対する独自の切り口や解釈を明確に`);
      recommendations.push('📌 年齢を超えた普遍的な価値や魅力を提示');
    } else if (type === 'niche') {
      recommendations.push('📌 「意外性」を最大の武器に: あなたの年齢 × ジャンルのギャップを楽しむ');
      recommendations.push(`📌 「${performerAge}歳が${personaAnalysis.keyword}をやってみた」という驚きを演出`);
      recommendations.push('📌 ニッチなポジションを確立し、熱狂的なコアファンを獲得');
      recommendations.push('📌 年齢の枠を超えた挑戦や情熱を全面に出す');
      recommendations.push('📌 専門性や独自の経験・視点を強調');
    } else {
      // revolutionary
      recommendations.push('📌 常識を覆す新しいカテゴリーを創造する');
      recommendations.push(`📌 「${performerAge}歳 × ${personaAnalysis.keyword}」という新ジャンルのパイオニアに`);
      recommendations.push('📌 年齢や既存の枠組みにとらわれない自由な表現');
      recommendations.push('📌 サプライズと感動を両立させるストーリーテリング');
      recommendations.push('📌 「年齢は関係ない」「好きなことを貫く」というメッセージ性を前面に');
    }

    // コンテンツスタイルの提案
    const videoStyle = personaAnalysis.contentPreferences.videoStyle;
    recommendations.push(`📌 推奨動画スタイル: ${videoStyle}をベースに、あなたらしさをミックス`);

    return recommendations;
  }
}
