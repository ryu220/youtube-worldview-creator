import { NextRequest, NextResponse } from 'next/server';
import { FourPillarsEngine, TEN_STEMS, TWELVE_BRANCHES, Pillar } from '@/engines/four-pillars';
import { WorldViewGenerator } from '@/generators/world-view';
import { GeminiClient } from '@/lib/gemini-client';
import { PersonaAnalyzer } from '@/analyzers/persona';
import { UniquePositioningAnalyzer } from '@/analyzers/positioning';

// Helper function to convert Pillar to extended format for Gemini API
function extendPillar(pillar: Pillar) {
  const stemInfo = TEN_STEMS[pillar.stem];
  const _branchInfo = TWELVE_BRANCHES[pillar.branch];

  return {
    stem: pillar.stem,
    branch: pillar.branch,
    element: stemInfo.element,
    yinYang: stemInfo.yin_yang,
  };
}

// Helper function to calculate age from birthDate
function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      birthDate,
      gender,
      seoKeyword,
      geminiApiKey,
    } = body;

    // バリデーション
    if (!name || !birthDate || !gender || !seoKeyword) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 出生時刻はデフォルトで12:00を使用（四柱推命分析用）
    const birthTime = '12:00';

    // ペルソナ分析（SEOキーワードから視聴者層を分析）
    const personaAnalyzer = new PersonaAnalyzer();
    const personaAnalysis = personaAnalyzer.analyze(seoKeyword);

    // 演者年齢を計算
    const performerAge = calculateAge(birthDate);

    // 独自ポジショニング分析（演者年齢 × ペルソナ）
    const positioningAnalyzer = new UniquePositioningAnalyzer();
    const positioningAnalysis = positioningAnalyzer.analyze(performerAge, personaAnalysis);

    // 四柱推命分析
    const fourPillarsEngine = new FourPillarsEngine();
    const appraisal = fourPillarsEngine.analyze(birthDate, birthTime);

    // 世界観コンセプト生成（四柱推命結果を活用）
    const worldViewGenerator = new WorldViewGenerator();
    const worldViewConcept = worldViewGenerator.generate({
      appraisal,
      seoKeyword,
      performerAge: calculateAge(birthDate), // 演者の年齢を計算
      gender,
    });

    // Gemini AIによる詳細な鑑定分析（オプション）
    let geminiAppraisal = null;
    if (geminiApiKey) {
      try {
        const geminiClient = new GeminiClient(geminiApiKey);
        geminiAppraisal = await geminiClient.analyzeWithGemini25Pro({
          name,
          birthDate,
          gender,
          seoKeyword,
          performerAge,
          fourPillars: {
            year: extendPillar(appraisal.pillars.year),
            month: extendPillar(appraisal.pillars.month),
            day: extendPillar(appraisal.pillars.day),
            hour: extendPillar(appraisal.pillars.hour),
          },
          fiveElements: appraisal.fiveElements,
          personality: appraisal.personality,
          personaAnalysis, // ペルソナ分析結果を追加
          positioningAnalysis, // ポジショニング分析結果を追加
        });
      } catch (geminiError) {
        console.error('Gemini API呼び出しに失敗しましたが、処理を続行します:', geminiError);
        // Gemini APIが失敗しても、四柱推命と世界観コンセプトは返す
      }
    }

    // レスポンス作成（ペルソナ分析 + ポジショニング分析 + 四柱推命 + 世界観コンセプト + Gemini鑑定）
    const response = {
      creator: {
        name,
        birthDate,
        gender,
        seoKeyword,
        performerAge,
      },
      // ペルソナ分析結果（SEOキーワードから推定）
      personaAnalysis,
      // 独自ポジショニング分析結果（演者年齢 × ペルソナ）
      positioningAnalysis,
      // 四柱推命鑑定結果
      fourPillarsAppraisal: {
        pillars: appraisal.pillars,
        fiveElements: appraisal.fiveElements,
        personality: appraisal.personality,
        colorPalette: appraisal.colorPalette,
      },
      // 世界観コンセプト（メイン機能）
      worldViewConcept,
      // Gemini AIによる詳細鑑定（補足）
      geminiAppraisal,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: '分析中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
