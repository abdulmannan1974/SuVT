
import React, { useState } from 'react';
import { DecisionState, Extremity, TreatmentRecommendation } from './types';
import { 
  ChevronRight, 
  RotateCcw, 
  Info, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Microscope,
  Award
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<DecisionState>({
    step: 'presentation'
  });

  const reset = () => setState({ step: 'presentation' });

  const getRecommendation = (): TreatmentRecommendation | null => {
    if (state.diagnosisType === 'DVT') {
      return {
        title: "Treat as a DVT",
        description: "Therapeutic dose of anticoagulation for a minimum of 3-6 months.",
        type: 'DVT_TREATMENT'
      };
    }

    if (state.step === 'result' || state.step === 'followup') {
      if (state.proximityToDeepVeins) {
        return {
          title: "Treat as a DVT",
          description: "Therapeutic dose of anticoagulation for a minimum of 3-6 months.",
          type: 'DVT_TREATMENT'
        };
      }

      if (state.thrombusLengthGreater5cm) {
        return {
          title: "Fondaparinux 2.5 mg/d for 45 d, then reassess",
          description: "Recommended treatment for thrombus > 5cm in length.",
          alternatives: ["Rivaroxaban 10 mg/d", "Low-molecular-weight heparin (e.g., enoxaparin 40 mg/d)"],
          type: 'FONDAPARINUX'
        };
      }

      if (state.step === 'followup') {
        if (state.persistentSymptomsAfter72h) {
          return {
            title: "Fondaparinux 2.5 mg/d",
            description: "Symptoms are persistent or worsening after 72h.",
            alternatives: ["Rivaroxaban 10 mg/d", "Enoxaparin 40 mg/d"],
            type: 'REASSESS_FONDA'
          };
        } else {
          return {
            title: "Continue conservative treatment",
            description: "Symptoms are improving. Maintain current regimen.",
            type: 'CONSERVATIVE'
          };
        }
      }

      return {
        title: "Conservative therapy",
        description: "Warm compresses, compression therapy with elastic compression stockings, NSAIDs, topical creams, limb elevation.",
        caveats: ["If there are multiple risk factors (e.g., prior VTE, known thrombophilia, active cancer), consider low-intensity anticoagulation (e.g., fondaparinux 2.5 mg/d)"],
        type: 'CONSERVATIVE'
      };
    }

    return null;
  };

  const renderStep = () => {
    switch (state.step) {
      case 'presentation':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-[#5c5b9b] text-white p-6 rounded-lg shadow-lg relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-4">Patient Presentation</h2>
              <p className="mb-4 text-gray-100">Signs and symptoms of superficial vein thrombosis (SuVT):</p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-2 mb-12">
                <li>Pain</li>
                <li>Erythema</li>
                <li>Swelling</li>
                <li>Presence of tender palpable cord</li>
              </ul>
              
              {/* Reset button inside the card as per screenshot */}
              <div className="bg-white/10 p-4 -mx-6 -mb-6 mt-6 flex justify-center">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-white font-bold text-lg hover:text-gray-200 transition-colors"
                >
                  <RotateCcw size={22} strokeWidth={2.5} /> New Patient Assessment
                </button>
              </div>
            </div>
            
            <div className="bg-[#f2e7c9] p-6 rounded-lg shadow-sm border border-[#dec684]">
              <h3 className="text-sm font-bold text-[#8b6e21] uppercase tracking-wider mb-4">CLINICAL PRESENTATION & ASSESSMENT</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-sm mb-2 text-[#7a601a]">Physical Examination</h4>
                  <p className="text-sm text-gray-700">Examine extremity to assess extent of symptoms.</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-2 text-[#7a601a]">Risk Factor Assessment</h4>
                  <ul className="text-xs space-y-2 text-gray-600">
                    <li><span className="font-semibold text-gray-800">Personal history:</span> Previous SuVT</li>
                    <li><span className="font-semibold text-gray-800">Clinical risk factors:</span> Active cancer, VTE history, Age > 65y, Estrogen use.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={() => setState(prev => ({ ...prev, step: 'diagnosis' }))}
                className="bg-[#5c5b9b] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-[#4a497a] transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Proceed to Diagnosis <ChevronRight size={20} />
              </button>
            </div>
          </div>
        );

      case 'diagnosis':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-[#f2e7c9] p-6 rounded-lg shadow-sm border border-[#dec684]">
              <div className="flex items-start gap-3">
                <Microscope className="text-[#8b6e21] flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-[#8b6e21] mb-2 uppercase text-sm tracking-widest">Diagnosis</h2>
                  <p className="font-bold">Duplex ultrasonography of superficial and deep veins</p>
                  <p className="text-sm text-gray-600 mt-1 italic">Can establish diagnosis and demonstrate location and length of thrombus.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button 
                onClick={() => setState(prev => ({ ...prev, diagnosisType: 'SuVT', step: 'management' }))}
                className="bg-[#c2c1e0] p-8 rounded-2xl text-[#5c5b9b] font-bold text-center hover:bg-[#b0afe0] transition-all shadow-sm"
              >
                SuVT Present
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, diagnosisType: 'DVT', step: 'result' }))}
                className="bg-[#c2c1e0] p-8 rounded-2xl text-[#5c5b9b] font-bold text-center hover:bg-[#b0afe0] transition-all shadow-sm"
              >
                Deep Vein Thrombosis (DVT) Present
              </button>
            </div>
          </div>
        );

      case 'management':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-[#f2e7c9] p-4 rounded-lg border border-[#dec684]">
               <h2 className="text-lg font-bold text-[#8b6e21] uppercase text-center">Management of SuVT</h2>
            </div>

            {!state.extremity ? (
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setState(prev => ({ ...prev, extremity: 'lower' }))}
                  className="bg-white p-10 rounded-2xl border-2 border-dashed border-[#dec684] text-[#8b6e21] font-bold text-center hover:bg-[#fcf8ed] transition-all"
                >
                  LOWER EXTREMITY SuVT
                </button>
                <button 
                  onClick={() => setState(prev => ({ ...prev, extremity: 'upper' }))}
                  className="bg-white p-10 rounded-2xl border-2 border-dashed border-[#dec684] text-[#8b6e21] font-bold text-center hover:bg-[#fcf8ed] transition-all"
                >
                  UPPER EXTREMITY SuVT
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-[#8b6e21] font-bold">
                  <button onClick={() => setState(prev => ({ ...prev, extremity: undefined }))} className="hover:underline">Management</button>
                  <ChevronRight size={14} />
                  <span>{state.extremity.toUpperCase()} EXTREMITY</span>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold mb-6 text-gray-800">
                    Thrombus is &lt; 3 cm from {state.extremity === 'lower' ? 'saphenofemoral venous junction' : 'deep veins'}?
                  </h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setState(prev => ({ ...prev, proximityToDeepVeins: true, step: 'result' }))}
                      className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-md"
                    >
                      YES
                    </button>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, proximityToDeepVeins: false }))}
                      className="flex-1 bg-rose-500 text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-md"
                    >
                      NO
                    </button>
                  </div>
                </div>

                {state.proximityToDeepVeins === false && (
                   <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 animate-in slide-in-from-bottom duration-300">
                    <h3 className="text-lg font-bold mb-6 text-gray-800">
                      Thrombus is &gt; 5 cm in length?
                    </h3>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setState(prev => ({ ...prev, thrombusLengthGreater5cm: true, step: 'result' }))}
                        className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-md"
                      >
                        YES
                      </button>
                      <button 
                        onClick={() => setState(prev => ({ ...prev, thrombusLengthGreater5cm: false, step: 'result' }))}
                        className="flex-1 bg-rose-500 text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-md"
                      >
                        NO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'result':
        const rec = getRecommendation();
        const isConservative = rec?.type === 'CONSERVATIVE';

        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className={`p-8 rounded-3xl shadow-2xl border-t-8 ${
              rec?.type === 'DVT_TREATMENT' ? 'bg-blue-50 border-blue-500' : 
              rec?.type === 'FONDAPARINUX' ? 'bg-emerald-50 border-emerald-500' :
              'bg-[#fdfcf5] border-[#5c5b9b]'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className={`${
                   rec?.type === 'DVT_TREATMENT' ? 'text-blue-500' : 
                   rec?.type === 'FONDAPARINUX' ? 'text-emerald-500' :
                   'text-[#5c5b9b]'
                }`} size={36} />
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">{rec?.title}</h2>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-gray-200 pl-4">{rec?.description}</p>

              {rec?.alternatives && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Alternative Treatments</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {rec.alternatives.map((alt, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 bg-white/50 p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {isConservative && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold mb-6 text-gray-800">
                  Follow-up: Are symptoms persistent or worsening after 72 h?
                </h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, step: 'followup', persistentSymptomsAfter72h: true }))}
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 shadow-md"
                  >
                    YES
                  </button>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, step: 'followup', persistentSymptomsAfter72h: false }))}
                    className="flex-1 bg-rose-500 text-white py-4 rounded-xl font-bold hover:bg-rose-600 shadow-md"
                  >
                    NO
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'followup':
        const followRec = getRecommendation();
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
             <div className="p-10 bg-white rounded-3xl shadow-2xl border-t-8 border-[#5c5b9b]">
               <h2 className="text-3xl font-bold text-gray-900 mb-6">{followRec?.title}</h2>
               <p className="text-xl text-gray-700 italic border-l-4 border-[#5c5b9b] pl-4">{followRec?.description}</p>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Sticky Header with screenshot branding */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#5c5b9b] p-2.5 rounded-xl text-white shadow-[#5c5b9b44] shadow-xl">
                <Activity size={36} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                    SuVT <span className="text-[#5c5b9b]">Protocols</span>
                  </h1>
                  <div className="bg-white border border-red-500 rounded px-2 py-0.5 flex items-center gap-1">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">BLOOD</span>
                    <span className="text-red-600 text-[10px]">🩸</span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">DOCTOR</span>
                  </div>
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.05em] mt-1.5 flex gap-1 items-baseline">
                  BY DR ABDUL MANNAN <span className="text-gray-400 tracking-tight">FRCPath FCPS</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#e8eaf2] px-4 py-1.5 rounded-full border border-[#d1d5db] shadow-sm">
               <Award size={14} className="text-[#5c5b9b]" />
               <span className="text-[11px] font-bold text-[#5c5b9b] uppercase tracking-wide">Evidence-Based Care</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        {/* Progress bar */}
        <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full mb-14 overflow-hidden shadow-inner">
          <div 
            className="bg-[#5c5b9b] h-full transition-all duration-700 ease-out" 
            style={{ width: `${
              state.step === 'presentation' ? 25 : 
              state.step === 'diagnosis' ? 50 : 
              state.step === 'management' ? 75 : 100
            }%` }}
          />
        </div>

        {renderStep()}
      </main>

      {/* Persistence Restart Button is now only inside the presentation card to match the screenshot better for that specific view */}
      {state.step !== 'presentation' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50 pointer-events-none">
           <button 
            onClick={reset}
            className="pointer-events-auto bg-[#5c5b9b] text-white py-3 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xl transition-all hover:bg-[#4a497a]"
          >
            <RotateCcw size={20} strokeWidth={2.5} /> Restart Protocol
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
