import { Element } from './constants';

/**
 * 優勢な五行から性格特性を導出
 */
export function getTraitsFromElement(element: Element): string[] {
  const traits: Record<Element, string[]> = {
    木: ['成長志向', '柔軟性', 'クリエイティブ', '楽観的', '社交的'],
    火: ['情熱的', 'カリスマ性', '表現力豊か', '直感的', 'エネルギッシュ'],
    土: ['安定志向', '誠実', '実直', '信頼できる', '穏やか'],
    金: ['論理的', '正確', '規律正しい', '完璧主義', '冷静'],
    水: ['知的', '柔軟', '直感的', '適応力', '神秘的'],
  };

  return traits[element];
}

/**
 * 五行バランスから総合的な性格分析
 */
export function analyzePersonality(
  dominantElement: Element,
  weakElement: Element
): {
  strengths: string[];
  weaknesses: string[];
  communicationStyle: string;
} {
  const elementStrengths: Record<Element, string[]> = {
    木: ['創造力', '成長意欲', '社交性'],
    火: ['情熱', 'リーダーシップ', 'カリスマ'],
    土: ['安定性', '誠実さ', '信頼性'],
    金: ['論理性', '正確性', '規律'],
    水: ['知性', '柔軟性', '直感力'],
  };

  const elementWeaknesses: Record<Element, string[]> = {
    木: ['頑固さ', '理想主義'],
    火: ['短気', '衝動的'],
    土: ['頑固', '変化への抵抗'],
    金: ['冷淡', '融通が利かない'],
    水: ['優柔不断', '神経質'],
  };

  const communicationStyles: Record<Element, string> = {
    木: '親しみやすく、明るいコミュニケーション',
    火: '情熱的で、エネルギッシュなコミュニケーション',
    土: '誠実で、落ち着いたコミュニケーション',
    金: '論理的で、正確なコミュニケーション',
    水: '知的で、柔軟なコミュニケーション',
  };

  return {
    strengths: elementStrengths[dominantElement],
    weaknesses: elementWeaknesses[weakElement],
    communicationStyle: communicationStyles[dominantElement],
  };
}
