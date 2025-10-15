import { calculateFourPillars, FourPillars } from './calendar';
import { analyzeFiveElements, FiveElementsBalance } from './five-elements';
import { getTraitsFromElement, analyzePersonality } from './personality-traits';
import { getColorAffinity, generateColorPalette, ColorAffinity } from './color-affinity';

export interface FourPillarsAnalysisResult {
  pillars: FourPillars;
  fiveElements: FiveElementsBalance;
  personality: {
    traits: string[];
    strengths: string[];
    weaknesses: string[];
    communicationStyle: string;
  };
  colorAffinity: ColorAffinity;
  colorPalette: {
    main: string;
    accent: string[];
    base: string[];
  };
}

export class FourPillarsEngine {
  /**
   * 生年月日時から四柱推命分析を実行
   */
  analyze(birthDate: string, birthTime?: string): FourPillarsAnalysisResult {
    // 四柱を計算
    const pillars = calculateFourPillars(birthDate, birthTime);

    // 五行バランスを分析
    const fiveElements = analyzeFiveElements(pillars);

    // 性格特性を導出
    const elementTraits = getTraitsFromElement(fiveElements.dominant);
    const personalityAnalysis = analyzePersonality(fiveElements.dominant, fiveElements.weak);

    // 色彩傾向を算出
    const colorAffinity = getColorAffinity(fiveElements.dominant, fiveElements.weak);
    const colorPalette = generateColorPalette(fiveElements.dominant);

    return {
      pillars,
      fiveElements,
      personality: {
        traits: elementTraits,
        strengths: personalityAnalysis.strengths,
        weaknesses: personalityAnalysis.weaknesses,
        communicationStyle: personalityAnalysis.communicationStyle,
      },
      colorAffinity,
      colorPalette,
    };
  }
}

export * from './calendar';
export * from './constants';
export * from './five-elements';
export * from './personality-traits';
export * from './color-affinity';
