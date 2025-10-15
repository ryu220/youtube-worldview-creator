'use client';

import { useState } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    gender: '女性',
    nationality: 'JP',
    genre: 'VLOG',
    targetAge: '20代',
    targetGender: '女性',
    geminiApiKey: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('分析に失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            YouTube World View Creator
          </h1>
          <p className="text-xl text-gray-600">
            AI × 四柱推命 × 算命学で、あなたのYouTubeチャンネルの世界観を自動生成
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!result ? (
            /* 入力フォーム */
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">クリエイター情報を入力</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本情報 */}
                <div>
                  <label className="block text-sm font-medium mb-2">名前（芸名可）*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">生年月日 *</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      出生時刻（不明の場合は12:00）
                    </label>
                    <input
                      type="time"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">性別 *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="女性">女性</option>
                      <option value="男性">男性</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">参入ジャンル *</label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="VLOG">VLOG・日常</option>
                      <option value="ゲーム実況">ゲーム実況</option>
                      <option value="美容・コスメ">美容・コスメ</option>
                      <option value="料理・グルメ">料理・グルメ</option>
                      <option value="教育・学習">教育・学習</option>
                      <option value="エンタメ">エンタメ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ターゲット年齢層 *</label>
                    <select
                      name="targetAge"
                      value={formData.targetAge}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="10代">10代</option>
                      <option value="20代">20代</option>
                      <option value="30代">30代</option>
                      <option value="40代以上">40代以上</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ターゲット性別 *</label>
                    <select
                      name="targetGender"
                      value={formData.targetGender}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="女性">女性</option>
                      <option value="男性">男性</option>
                      <option value="全て">全て</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gemini APIキー（AI鑑定分析・任意）
                  </label>
                  <input
                    type="password"
                    name="geminiApiKey"
                    value={formData.geminiApiKey}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="AIzaSy..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    APIキーを入力すると、Gemini AIによる詳細な鑑定分析が追加されます。<br />
                    APIキーがない場合は、基本的な四柱推命分析のみが表示されます。<br />
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      Google AI StudioでAPIキーを取得
                    </a>
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg"
                >
                  {loading ? '分析中...' : '分析開始'}
                </button>
              </form>
            </div>
          ) : (
            /* レポート表示 */
            <div className="space-y-6">
              <button
                onClick={() => setResult(null)}
                className="btn-secondary"
              >
                ← 新しい分析を開始
              </button>

              {/* 四柱推命鑑定結果 */}
              {result.fourPillarsAppraisal && (
                <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-orange-900">四柱推命鑑定結果</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-orange-900 mb-2">五行バランス</h3>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(result.fourPillarsAppraisal.fiveElements).map(([element, count]) => (
                          <span key={element} className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                            {element}: {String(count)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-orange-900 mb-2">性格特性</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-orange-800">特性:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {result.fourPillarsAppraisal.personality.traits.map((trait: string, index: number) => (
                              <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-800">強み:</p>
                          <ul className="list-disc list-inside text-gray-800 text-sm">
                            {result.fourPillarsAppraisal.personality.strengths.map((strength: string, index: number) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-800">弱み:</p>
                          <ul className="list-disc list-inside text-gray-800 text-sm">
                            {result.fourPillarsAppraisal.personality.weaknesses.map((weakness: string, index: number) => (
                              <li key={index}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-800">コミュニケーションスタイル:</p>
                          <p className="text-gray-800 text-sm">{result.fourPillarsAppraisal.personality.communicationStyle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-orange-900 mb-2">カラーパレット</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-orange-800 mb-1">メインカラー:</p>
                          <div className="flex gap-2">
                            <div className="flex flex-col items-center">
                              <div
                                className="w-20 h-20 rounded-lg shadow-md"
                                style={{ backgroundColor: result.fourPillarsAppraisal.colorPalette.main }}
                              />
                              <span className="text-xs mt-1 text-gray-600">{result.fourPillarsAppraisal.colorPalette.main}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-800 mb-1">アクセントカラー:</p>
                          <div className="flex gap-2">
                            {result.fourPillarsAppraisal.colorPalette.accent.map((color: string, index: number) => (
                              <div key={index} className="flex flex-col items-center">
                                <div
                                  className="w-16 h-16 rounded-lg shadow-md"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs mt-1 text-gray-600">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-800 mb-1">ベースカラー:</p>
                          <div className="flex gap-2">
                            {result.fourPillarsAppraisal.colorPalette.base.map((color: string, index: number) => (
                              <div key={index} className="flex flex-col items-center">
                                <div
                                  className="w-16 h-16 rounded-lg shadow-md"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs mt-1 text-gray-600">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 世界観コンセプト（メイン機能） */}
              {result.worldViewConcept && (
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <h2 className="text-2xl font-bold text-purple-900">YouTubeチャンネル世界観コンセプト</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-purple-900 mb-2">テーマ</h3>
                      <p className="text-xl font-bold text-purple-600">{result.worldViewConcept.theme}</p>
                      <p className="text-sm text-gray-700 mt-2">{result.worldViewConcept.description}</p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-purple-900 mb-2">推奨カラーパレット</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-purple-800 mb-1">メインカラー:</p>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-20 h-20 rounded-lg shadow-md"
                              style={{ backgroundColor: result.worldViewConcept.colorPalette.main.hex }}
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{result.worldViewConcept.colorPalette.main.name}</p>
                              <p className="text-xs text-gray-600">{result.worldViewConcept.colorPalette.main.hex}</p>
                              <p className="text-xs text-gray-600 mt-1">{result.worldViewConcept.colorPalette.main.usage}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800 mb-1">アクセントカラー:</p>
                          <div className="flex gap-3">
                            {result.worldViewConcept.colorPalette.accent.map((color: { name: string; hex: string; usage: string }, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div
                                  className="w-16 h-16 rounded-lg shadow-md"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{color.name}</p>
                                  <p className="text-xs text-gray-600">{color.hex}</p>
                                  <p className="text-xs text-gray-600">{color.usage}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800 mb-1">ベースカラー:</p>
                          <div className="flex gap-3">
                            {result.worldViewConcept.colorPalette.base.map((color: { name: string; hex: string; usage: string }, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div
                                  className="w-16 h-16 rounded-lg shadow-md"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{color.name}</p>
                                  <p className="text-xs text-gray-600">{color.hex}</p>
                                  <p className="text-xs text-gray-600">{color.usage}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-purple-900 mb-2">トーン&マナー</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-purple-800">ビジュアルスタイル:</p>
                          <p className="text-gray-800">{result.worldViewConcept.toneAndManner.visualStyle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">ムード:</p>
                          <p className="text-gray-800">{result.worldViewConcept.toneAndManner.mood}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">推奨フォント:</p>
                          <p className="text-gray-800">{result.worldViewConcept.toneAndManner.typography}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-purple-900 mb-2">制作推奨事項</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-purple-800">サムネイルスタイル:</p>
                          <p className="text-gray-800 text-sm">{result.worldViewConcept.recommendations.thumbnailStyle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">撮影スタイル:</p>
                          <p className="text-gray-800 text-sm">{result.worldViewConcept.recommendations.shootingStyle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-800">編集スタイル:</p>
                          <p className="text-gray-800 text-sm">{result.worldViewConcept.recommendations.editing}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gemini AI詳細分析（オプション） */}
              {result.geminiAppraisal && (
                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-blue-900">✨ あなたの個性分析（AI詳細版）</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-900 mb-2">✨ あなたの本質</h3>
                      <p className="text-gray-800 leading-relaxed">
                        {typeof result.geminiAppraisal.yourEssence === 'string'
                          ? result.geminiAppraisal.yourEssence
                          : JSON.stringify(result.geminiAppraisal.yourEssence)}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-900 mb-2">🎭 性格・才能</h3>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {typeof result.geminiAppraisal.personality === 'string'
                          ? result.geminiAppraisal.personality
                          : JSON.stringify(result.geminiAppraisal.personality, null, 2)}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-900 mb-2">💎 YouTubeで活かせる才能</h3>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {typeof result.geminiAppraisal.talents === 'string'
                          ? result.geminiAppraisal.talents
                          : JSON.stringify(result.geminiAppraisal.talents, null, 2)}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-900 mb-2">🎬 あなたのクリエイタータイプ</h3>
                      <p className="text-xl font-bold text-blue-600">
                        {typeof result.geminiAppraisal.performerType === 'string'
                          ? result.geminiAppraisal.performerType
                          : JSON.stringify(result.geminiAppraisal.performerType)}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-900 mb-2">🎨 チャンネルづくりのヒント</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-blue-800 mb-2">📌 テーマキーワード:</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(result.geminiAppraisal.worldviewConcept.keywords) ? (
                              result.geminiAppraisal.worldviewConcept.keywords.map((keyword: string, index: number) => (
                                <span key={index} className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-medium">
                                  {keyword}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-800 text-sm">
                                {JSON.stringify(result.geminiAppraisal.worldviewConcept.keywords)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800 mb-2">🎬 映像の雰囲気:</p>
                          <p className="text-gray-800 leading-relaxed">
                            {typeof result.geminiAppraisal.worldviewConcept.visualDirection === 'string'
                              ? result.geminiAppraisal.worldviewConcept.visualDirection
                              : JSON.stringify(result.geminiAppraisal.worldviewConcept.visualDirection, null, 2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800 mb-2">🎨 おすすめの色使い:</p>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {typeof result.geminiAppraisal.worldviewConcept.colorPhilosophy === 'string'
                              ? result.geminiAppraisal.worldviewConcept.colorPhilosophy
                              : JSON.stringify(result.geminiAppraisal.worldviewConcept.colorPhilosophy, null, 2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800 mb-2">💡 おすすめ動画企画:</p>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {typeof result.geminiAppraisal.worldviewConcept.contentStrategy === 'string'
                              ? result.geminiAppraisal.worldviewConcept.contentStrategy
                              : JSON.stringify(result.geminiAppraisal.worldviewConcept.contentStrategy, null, 2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-blue-900 mb-2">🌟 総合アドバイス</h3>
                      <div className="text-gray-800 prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                        {typeof result.geminiAppraisal.detailedAnalysis === 'string'
                          ? result.geminiAppraisal.detailedAnalysis
                          : JSON.stringify(result.geminiAppraisal.detailedAnalysis, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
