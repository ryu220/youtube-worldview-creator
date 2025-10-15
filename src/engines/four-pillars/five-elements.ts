import { FourPillars } from './calendar';
import { TEN_STEMS, TWELVE_BRANCHES, Element } from './constants';

export interface FiveElementsBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: Element;
  weak: Element;
}

/**
 * 四柱から五行のバランスを計算
 */
export function analyzeFiveElements(pillars: FourPillars): FiveElementsBalance {
  const balance: Record<Element, number> = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  };

  // 各柱の干支から五行をカウント
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach((pillar) => {
    const stemElement = TEN_STEMS[pillar.stem].element as Element;
    const branchElement = TWELVE_BRANCHES[pillar.branch].element as Element;

    balance[stemElement] += 1.0; // 天干の重み
    balance[branchElement] += 0.7; // 地支の重み（やや軽め）
  });

  // 最も強い要素と最も弱い要素を特定
  const elements = Object.entries(balance) as [Element, number][];
  elements.sort((a, b) => b[1] - a[1]);

  const dominant = elements[0][0];
  const weak = elements[elements.length - 1][0];

  return {
    wood: balance['木'],
    fire: balance['火'],
    earth: balance['土'],
    metal: balance['金'],
    water: balance['水'],
    dominant,
    weak,
  };
}
