import { NextRequest, NextResponse } from 'next/server';
import { FourPillarsEngine } from '@/engines/four-pillars';
import { WorldViewGenerator } from '@/generators/world-view';
import { GeminiClient } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      birthDate,
      birthTime,
      gender,
      nationality,
      genre,
      targetAge,
      targetGender,
      geminiApiKey,
    } = body;

    // バリデーション
    if (!name || !birthDate || !gender || !genre || !targetAge || !targetGender) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 四柱推命分析
    const fourPillarsEngine = new FourPillarsEngine();
    const appraisal = fourPillarsEngine.analyze(birthDate, birthTime);

    // 世界観コンセプト生成（四柱推命結果を活用）
    const worldViewGenerator = new WorldViewGenerator();
    const worldViewConcept = worldViewGenerator.generate({
      appraisal,
      genre,
      targetAge,
      targetGender,
    });

    // Gemini AIによる詳細な鑑定分析（オプション）
    let geminiAppraisal = null;
    if (geminiApiKey) {
      try {
        const geminiClient = new GeminiClient(geminiApiKey);
        geminiAppraisal = await geminiClient.analyzeWithGemini25Pro({
          name,
          birthDate,
          birthTime,
          gender,
          nationality,
          genre,
          targetAge,
          targetGender,
          fourPillars: appraisal.pillars,
          fiveElements: appraisal.fiveElements,
          personality: appraisal.personality,
        });
      } catch (geminiError) {
        console.error('Gemini API呼び出しに失敗しましたが、処理を続行します:', geminiError);
        // Gemini APIが失敗しても、四柱推命と世界観コンセプトは返す
      }
    }

    // レスポンス作成（四柱推命 + 世界観コンセプト + Gemini鑑定）
    const response = {
      creator: {
        name,
        birthDate,
        gender,
        nationality,
        genre,
        targetAge,
        targetGender,
      },
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
