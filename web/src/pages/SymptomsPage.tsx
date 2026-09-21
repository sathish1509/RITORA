import { useState } from 'react';
import TopNav from '../components/layout/TopNav';
import { mockSymptoms } from '../data/mockData';
import type { SymptomType } from '../types';
import { Plus, X } from 'lucide-react';

const symptomOptions: { type: SymptomType; emoji: string; label: string }[] = [
  { type: 'cramps', emoji: '🔥', label: 'Cramps' },
  { type: 'headache', emoji: '🤕', label: 'Headache' },
  { type: 'bloating', emoji: '🎈', label: 'Bloating' },
  { type: 'fatigue', emoji: '😴', label: 'Fatigue' },
  { type: 'mood-swings', emoji: '🎭', label: 'Mood Swings' },
  { type: 'breast-tenderness', emoji: '💜', label: 'Tenderness' },
  { type: 'acne', emoji: '🔵', label: 'Acne' },
  { type: 'nausea', emoji: '🤢', label: 'Nausea' },
  { type: 'back-pain', emoji: '💢', label: 'Back Pain' },
  { type: 'insomnia', emoji: '🌙', label: 'Insomnia' },
  { type: 'anxiety', emoji: '😟', label: 'Anxiety' },
  { type: 'cravings', emoji: '🍫', label: 'Cravings' },
];

export default function SymptomsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<SymptomType | null>(null);
  const [severity, setSeverity] = useState(3);
  const [symptoms, setSymptoms] = useState(mockSymptoms);

  const handleLog = () => {
    if (!selectedType) return;
    setSymptoms([
      {
        id: `sym_${Date.now()}`,
        type: selectedType,
        severity: severity as 1 | 2 | 3 | 4 | 5,
        date: new Date().toISOString().split('T')[0],
      },
      ...symptoms,
    ]);
    setShowModal(false);
    setSelectedType(null);
    setSeverity(3);
  };

  // Group symptoms by date
  const grouped = symptoms.reduce<Record<string, typeof symptoms>>((acc, s) => {
    const d = new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(s);
    return acc;
  }, {});

  const getSymptomLabel = (type: string) => symptomOptions.find((s) => s.type === type);

  return (
    <div className="min-h-screen">
      <TopNav title="Symptoms" subtitle="Track and monitor your symptoms" />

      <div className="p-8">
        {/* Log Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 flex items-center gap-2 px-5 py-3 rounded-xl gradient-plum text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-plum/20"
        >
          <Plus className="w-5 h-5" />
          Log Symptom
        </button>

        {/* Symptom Timeline */}
        <div className="space-y-6 animate-fade-in">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-charcoal/50 mb-3">{date}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map((s) => {
                  const info = getSymptomLabel(s.type);
                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl border border-lilac/30 p-4 hover:shadow-md hover:shadow-plum/5 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{info?.emoji || '❓'}</span>
                          <div>
                            <p className="text-sm font-semibold text-charcoal">{info?.label || s.type}</p>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-1.5 rounded-full ${
                                    i <= s.severity ? 'bg-plum' : 'bg-lilac/30'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-charcoal/30">
                          Severity {s.severity}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between p-6 border-b border-lilac/20">
                <h3 className="text-lg font-bold text-charcoal">Log Symptom</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-lilac/20 transition-colors">
                  <X className="w-5 h-5 text-charcoal/40" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-charcoal mb-3">Select symptom</p>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {symptomOptions.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setSelectedType(opt.type)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedType === opt.type
                          ? 'border-plum bg-plum/5 shadow-md shadow-plum/10'
                          : 'border-lilac/30 hover:border-lavender'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{opt.emoji}</span>
                      <span className="text-xs font-medium text-charcoal">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-sm font-medium text-charcoal mb-3">
                  Severity: <span className="text-plum">{severity}/5</span>
                </p>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-2 bg-lilac/30 rounded-lg appearance-none cursor-pointer accent-plum mb-6"
                />

                <button
                  onClick={handleLog}
                  disabled={!selectedType}
                  className="w-full py-3 rounded-xl gradient-plum text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Log Symptom
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
