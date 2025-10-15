import { Element, FIVE_ELEMENTS, GENERATING_CYCLE, CONTROLLING_CYCLE } from './constants';

export interface ColorAffinity {
  favorable: string[]; // 吉色
  neutral: string[]; // 中性色
  unfavorable: string[]; // 凶色
}

/**
 * 五行から色彩傾向を算出
 */
export function getColorAffinity(dominantElement: Element, weakElement: Element): ColorAffinity {
  const elementColors: Record<Element, string[]> = {
    木: ['#4CAF50', '#8BC34A', '#66BB6A', '#81C784', '#A5D6A7'], // 緑系
    火: ['#F44336', '#FF5722', '#E91E63', '#FF6F00', '#FF8A65'], // 赤系
    土: ['#FFC107', '#FF9800', '#FFEB3B', '#FDD835', '#FFE082'], // 黄系
    金: ['#9E9E9E', '#BDBDBD', '#FFFFFF', '#E0E0E0', '#CFD8DC'], // 白・グレー系
    水: ['#2196F3', '#03A9F4', '#00BCD4', '#0288D1', '#4FC3F7'], // 青系
  };

  // 相生関係の色は吉
  const favorable = [
    ...elementColors[dominantElement],
    ...elementColors[GENERATING_CYCLE[dominantElement]],
  ];

  // 相剋関係の色は凶
  const unfavorable = elementColors[CONTROLLING_CYCLE[dominantElement]];

  // それ以外は中性
  const allElements: Element[] = ['木', '火', '土', '金', '水'];
  const neutral = allElements
    .filter(
      (el) =>
        el !== dominantElement &&
        el !== GENERATING_CYCLE[dominantElement] &&
        el !== CONTROLLING_CYCLE[dominantElement]
    )
    .flatMap((el) => elementColors[el]);

  return {
    favorable,
    neutral,
    unfavorable,
  };
}

/**
 * 五行から推奨カラーパレットを生成
 */
export function generateColorPalette(dominantElement: Element): {
  main: string;
  accent: string[];
  base: string[];
} {
  const elementPalettes: Record<Element, { main: string; accent: string[]; base: string[] }> = {
    木: {
      main: '#66BB6A', // メインカラー: 若草色
      accent: ['#8BC34A', '#FDD835'], // アクセント: ライムグリーン、黄色
      base: ['#FFFFFF', '#F5F5F5', '#E8F5E9'], // ベース: 白、ライトグリーン
    },
    火: {
      main: '#FF6F00', // メインカラー: オレンジ
      accent: ['#F44336', '#FFEB3B'], // アクセント: 赤、黄色
      base: ['#FFFFFF', '#FFF3E0', '#FFEBEE'], // ベース: 白、淡いオレンジ
    },
    土: {
      main: '#E8D5C4', // メインカラー: ウォームベージュ
      accent: ['#D4A5A5', '#9CAF88'], // アクセント: ダスティローズ、セージグリーン
      base: ['#FAF7F2', '#E5E5E5'], // ベース: アイボリー、ライトグレー
    },
    金: {
      main: '#CFD8DC', // メインカラー: ブルーグレー
      accent: ['#9E9E9E', '#BDBDBD'], // アクセント: グレー
      base: ['#FFFFFF', '#FAFAFA', '#ECEFF1'], // ベース: 白
    },
    水: {
      main: '#0288D1', // メインカラー: 深い青
      accent: ['#4FC3F7', '#00BCD4'], // アクセント: 水色、シアン
      base: ['#FFFFFF', '#E1F5FE', '#B3E5FC'], // ベース: 白、淡い青
    },
  };

  return elementPalettes[dominantElement];
}
