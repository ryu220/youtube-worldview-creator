import { Stem, Branch, TEN_STEMS, TWELVE_BRANCHES as _TWELVE_BRANCHES } from './constants';

export interface Pillar {
  stem: Stem;
  branch: Branch;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

/**
 * 年柱を計算
 * @param year - 西暦年
 * @returns 年柱の干支
 */
export function calculateYearPillar(year: number): Pillar {
  // 甲子年（1924年）を基準とする
  const baseYear = 1924;
  const offset = year - baseYear;

  const stemIndex = offset % 10;
  const branchIndex = offset % 12;

  const stems: Stem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches: Branch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  return {
    stem: stems[(stemIndex + 10) % 10],
    branch: branches[(branchIndex + 12) % 12],
  };
}

/**
 * 月柱を計算
 * @param year - 西暦年
 * @param month - 月（1-12）
 * @returns 月柱の干支
 */
export function calculateMonthPillar(year: number, month: number): Pillar {
  const yearPillar = calculateYearPillar(year);
  const yearStemIndex = TEN_STEMS[yearPillar.stem].index;

  // 年干によって月干の起点が変わる（五虎遁）
  const monthStemBase = [2, 4, 6, 8, 0]; // 甲己年=丙、乙庚年=戊、丙辛年=庚、丁壬年=壬、戊癸年=甲
  const baseIndex = monthStemBase[yearStemIndex % 5];

  // 1月は寅月から始まる
  const monthBranchIndex = (month + 1) % 12; // 1月=寅(2)
  const monthStemIndex = (baseIndex + month - 1) % 10;

  const stems: Stem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches: Branch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  return {
    stem: stems[monthStemIndex],
    branch: branches[monthBranchIndex],
  };
}

/**
 * 日柱を計算（ツェラーの公式を応用）
 * @param date - 日付オブジェクト
 * @returns 日柱の干支
 */
export function calculateDayPillar(date: Date): Pillar {
  // 1900年1月1日 = 庚子日を基準
  const baseDate = new Date(1900, 0, 1);
  const daysDiff = Math.floor(
    (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const stemIndex = (6 + daysDiff) % 10; // 庚=6
  const branchIndex = (0 + daysDiff) % 12; // 子=0

  const stems: Stem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches: Branch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  return {
    stem: stems[(stemIndex + 10) % 10],
    branch: branches[(branchIndex + 12) % 12],
  };
}

/**
 * 時柱を計算
 * @param dayPillar - 日柱
 * @param hour - 時刻（0-23）
 * @returns 時柱の干支
 */
export function calculateHourPillar(dayPillar: Pillar, hour: number): Pillar {
  const dayStemIndex = TEN_STEMS[dayPillar.stem].index;

  // 日干によって時干の起点が変わる（五鼠遁）
  const hourStemBase = [0, 2, 4, 6, 8]; // 甲己日=甲、乙庚日=丙、丙辛日=戊、丁壬日=庚、戊癸日=壬
  const baseIndex = hourStemBase[dayStemIndex % 5];

  // 時刻を2時間区切りの地支に変換（23-1時=子、1-3時=丑、...）
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const hourStemIndex = (baseIndex + hourBranchIndex) % 10;

  const stems: Stem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches: Branch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  return {
    stem: stems[hourStemIndex],
    branch: branches[hourBranchIndex],
  };
}

/**
 * 生年月日時から四柱を計算
 */
export function calculateFourPillars(
  birthDate: string,
  birthTime?: string
): FourPillars {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const hour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;

  const yearPillar = calculateYearPillar(year);
  const monthPillar = calculateMonthPillar(year, month);
  const dayPillar = calculateDayPillar(date);
  const hourPillar = calculateHourPillar(dayPillar, hour);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}
