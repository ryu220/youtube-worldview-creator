/**
 * 演者年齢とSEOキーワード（ペルソナ）の相性分析エンジン
 *
 * 演者の年齢±10歳理論に基づいて、ターゲット視聴者との適合度を計算
 */

import { PersonaAnalysisResult } from '@/analyzers/persona';

export interface CompatibilityAnalysisResult {
  compatibilityScore: number; // 0-100のスコア
  matchLevel: 'excellent' | 'good' | 'fair' | 'challenging';
  performerOptimalRange: string; // 演者の最適視聴者層（年齢±10）
  personaTargetRange: string; // ペルソナの想定視聴者層
  overlap: {
    exists: boolean;
    range: string;
  };
  recommendations: string[];
  warnings: string[];
}

/**
 * 相性分析エンジン
 */
export class CompatibilityAnalyzer {
  /**
   * 演者年齢とペルソナの相性を分析
   */
  analyze(performerAge: number, personaAnalysis: PersonaAnalysisResult): CompatibilityAnalysisResult {
    // 演者の最適視聴者層（±10歳理論）
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

    // 相性スコアを計算（0-100）
    const compatibilityScore = this.calculateCompatibilityScore(
      performerMinAge,
      performerMaxAge,
      personaMinAge,
      personaMaxAge,
      hasOverlap,
      overlapMinAge,
      overlapMaxAge
    );

    // マッチレベルを判定
    const matchLevel = this.determineMatchLevel(compatibilityScore);

    // 推奨事項を生成
    const recommendations = this.generateRecommendations(
      performerAge,
      personaMinAge,
      personaMaxAge,
      compatibilityScore,
      personaAnalysis
    );

    // 警告を生成
    const warnings = this.generateWarnings(
      performerAge,
      personaMinAge,
      personaMaxAge,
      hasOverlap
    );

    return {
      compatibilityScore,
      matchLevel,
      performerOptimalRange,
      personaTargetRange,
      overlap: {
        exists: hasOverlap,
        range: hasOverlap ? `${overlapMinAge}〜${overlapMaxAge}歳` : '重複なし',
      },
      recommendations,
      warnings,
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
   * 相性スコアを計算（0-100）
   */
  private calculateCompatibilityScore(
    performerMin: number,
    performerMax: number,
    personaMin: number,
    personaMax: number,
    hasOverlap: boolean,
    overlapMin: number,
    overlapMax: number
  ): number {
    if (!hasOverlap) {
      // 重複なし → スコア低い
      return 20;
    }

    // 重複範囲の広さ
    const overlapRange = overlapMax - overlapMin;
    const performerRange = performerMax - performerMin; // 通常20歳
    const personaRange = personaMax - personaMin;

    // 重複率（演者の最適範囲のうち、どれだけペルソナと重なっているか）
    const overlapRatioPerformer = overlapRange / performerRange;

    // 重複率（ペルソナの想定範囲のうち、どれだけ演者と重なっているか）
    const overlapRatioPersona = overlapRange / personaRange;

    // 両方の重複率の平均をベーススコアとする
    const averageOverlapRatio = (overlapRatioPerformer + overlapRatioPersona) / 2;

    // スコア = 重複率 × 100（最大100点）
    let score = averageOverlapRatio * 100;

    // ボーナス: 演者の年齢がペルソナの中心年齢に近い場合
    const personaCenter = (personaMin + personaMax) / 2;
    const ageDifference = Math.abs(performerMin + 10 - personaCenter); // 演者の中心年齢との差

    if (ageDifference <= 5) {
      score += 10; // 中心年齢が近い場合、+10点
    } else if (ageDifference <= 10) {
      score += 5; // やや近い場合、+5点
    }

    // スコアを0-100に収める
    return Math.min(100, Math.round(score));
  }

  /**
   * マッチレベルを判定
   */
  private determineMatchLevel(score: number): 'excellent' | 'good' | 'fair' | 'challenging' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'challenging';
  }

  /**
   * 推奨事項を生成
   */
  private generateRecommendations(
    performerAge: number,
    personaMin: number,
    personaMax: number,
    score: number,
    personaAnalysis: PersonaAnalysisResult
  ): string[] {
    const recommendations: string[] = [];

    if (score >= 80) {
      recommendations.push('あなたの年齢はこのジャンルに最適です！自信を持ってコンテンツを作成してください。');
      recommendations.push(`${performerAge}歳の視点や経験を活かした、同世代に刺さるコンテンツを意識しましょう。`);
    } else if (score >= 60) {
      recommendations.push('このジャンルとの相性は良好です。視聴者層との共通点を強調しましょう。');
      if (performerAge < personaMin) {
        recommendations.push('年上の視聴者向けに、少し落ち着いたトーンやアプローチを心がけると良いでしょう。');
      } else if (performerAge > personaMax) {
        recommendations.push('若い視聴者向けに、トレンドやエネルギッシュなコンテンツを意識すると良いでしょう。');
      }
    } else if (score >= 40) {
      recommendations.push('視聴者層とのギャップを個性として活かすアプローチが効果的です。');
      recommendations.push('年齢の違いを逆手に取り、「先輩」「後輩」的なポジショニングを明確にしましょう。');
      recommendations.push(`${personaAnalysis.keyword}に対する独自の視点や経験を強調してください。`);
    } else {
      recommendations.push('視聴者層とのギャップが大きいですが、これを強みに変えることが可能です。');
      recommendations.push('ニッチなポジショニングを確立し、「意外性」や「新鮮さ」を武器にしましょう。');
      recommendations.push('年齢を超えた普遍的なテーマや、専門知識を前面に出すアプローチが有効です。');
    }

    return recommendations;
  }

  /**
   * 警告を生成
   */
  private generateWarnings(
    performerAge: number,
    personaMin: number,
    personaMax: number,
    hasOverlap: boolean
  ): string[] {
    const warnings: string[] = [];

    if (!hasOverlap) {
      warnings.push('⚠️ 演者の最適視聴者層（±10歳）とペルソナの想定層が重複していません。');
      if (performerAge + 10 < personaMin) {
        const gap = personaMin - (performerAge + 10);
        warnings.push(`あなたの年齢（${performerAge}歳）は、想定視聴者層より${gap}歳以上若いです。視聴者からの共感を得にくい可能性があります。`);
      } else if (performerAge - 10 > personaMax) {
        const gap = (performerAge - 10) - personaMax;
        warnings.push(`あなたの年齢（${performerAge}歳）は、想定視聴者層より${gap}歳以上年上です。視聴者からの共感を得にくい可能性があります。`);
      }
    }

    return warnings;
  }
}
