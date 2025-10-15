// 十干（じゅっかん）
export const TEN_STEMS = {
  甲: { element: '木', yin_yang: '陽', index: 0 },
  乙: { element: '木', yin_yang: '陰', index: 1 },
  丙: { element: '火', yin_yang: '陽', index: 2 },
  丁: { element: '火', yin_yang: '陰', index: 3 },
  戊: { element: '土', yin_yang: '陽', index: 4 },
  己: { element: '土', yin_yang: '陰', index: 5 },
  庚: { element: '金', yin_yang: '陽', index: 6 },
  辛: { element: '金', yin_yang: '陰', index: 7 },
  壬: { element: '水', yin_yang: '陽', index: 8 },
  癸: { element: '水', yin_yang: '陰', index: 9 },
} as const;

export type Stem = keyof typeof TEN_STEMS;

// 十二支（じゅうにし）
export const TWELVE_BRANCHES = {
  子: { element: '水', yin_yang: '陽', index: 0, animal: '鼠' },
  丑: { element: '土', yin_yang: '陰', index: 1, animal: '牛' },
  寅: { element: '木', yin_yang: '陽', index: 2, animal: '虎' },
  卯: { element: '木', yin_yang: '陰', index: 3, animal: '兎' },
  辰: { element: '土', yin_yang: '陽', index: 4, animal: '竜' },
  巳: { element: '火', yin_yang: '陰', index: 5, animal: '蛇' },
  午: { element: '火', yin_yang: '陽', index: 6, animal: '馬' },
  未: { element: '土', yin_yang: '陰', index: 7, animal: '羊' },
  申: { element: '金', yin_yang: '陽', index: 8, animal: '猿' },
  酉: { element: '金', yin_yang: '陰', index: 9, animal: '鶏' },
  戌: { element: '土', yin_yang: '陽', index: 10, animal: '犬' },
  亥: { element: '水', yin_yang: '陰', index: 11, animal: '猪' },
} as const;

export type Branch = keyof typeof TWELVE_BRANCHES;

// 五行（ごぎょう）
export const FIVE_ELEMENTS = {
  木: { color: '#4CAF50', season: '春', direction: '東', emotion: '怒' },
  火: { color: '#F44336', season: '夏', direction: '南', emotion: '喜' },
  土: { color: '#FFC107', season: '土用', direction: '中央', emotion: '思' },
  金: { color: '#9E9E9E', season: '秋', direction: '西', emotion: '悲' },
  水: { color: '#2196F3', season: '冬', direction: '北', emotion: '恐' },
} as const;

export type Element = keyof typeof FIVE_ELEMENTS;

// 相生（そうしょう）: 木→火→土→金→水→木
export const GENERATING_CYCLE: Record<Element, Element> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
};

// 相剋（そうこく）: 木→土→水→火→金→木
export const CONTROLLING_CYCLE: Record<Element, Element> = {
  木: '土',
  土: '水',
  水: '火',
  火: '金',
  金: '木',
};

// 通変星（十神）
export const TEN_GODS = [
  '比肩', // 自分と同じ
  '劫財', // 奪い合う
  '食神', // 生み出す（陽）
  '傷官', // 生み出す（陰）
  '偏財', // 支配する（陽）
  '正財', // 支配する（陰）
  '偏官', // 支配される（陽）
  '正官', // 支配される（陰）
  '偏印', // 生まれる（陽）
  '印綬', // 生まれる（陰）
] as const;

export type TenGod = typeof TEN_GODS[number];
