import { useState, useEffect } from 'react';
import TopNav from '../components/layout/TopNav';
import { reportService } from '../services/reportService';
import type { Report } from '../types';
import {
  FileText,
  Download,
  Plus,
  Calendar,
  Activity,
  Moon,
  Droplets,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportType, setReportType] = useState<'monthly' | 'quarterly' | 'annual' | 'custom'>('monthly');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportService.getReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error('Failed to load reports', err);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newReport = await reportService.generateReport(reportType);
      setReports((prev) => [newReport, ...prev]);
      setSelectedReport(newReport);
    } catch (err) {
      console.error('Report generation failed', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <div className="no-print">
        <TopNav title="Clinical Health Reports" subtitle="Synthesized cycle & symptom intelligence for your healthcare provider" />
      </div>

      <div className="p-6 lg:p-8 max-w-7xl w-full mx-auto print-full-width">
        {/* Actions bar */}
        <div className="no-print bg-white rounded-3xl border border-lilac/30 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-plum" />
              Generate Cycle Health Summary
            </h3>
            <p className="text-xs text-charcoal/50 mt-0.5">
              Exports active cycle progression, baseline variations, symptom recurrence, and risk screening
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl bg-lilac/15 border border-lilac/30 text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-lavender"
            >
              <option value="monthly">Monthly Summary</option>
              <option value="quarterly">Quarterly Overview</option>
              <option value="annual">Annual Health Review</option>
              <option value="custom">Custom Comprehensive</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-5 py-2.5 rounded-xl gradient-plum text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-plum/20 disabled:opacity-50 shrink-0"
            >
              {generating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{generating ? 'Compiling AI Report...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>

        {/* Reports Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print-full-width">
          {/* Reports Sidebar */}
          <div className="lg:col-span-4 space-y-3 no-print">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal/40 px-1">
              Generated Reports ({reports.length})
            </h4>

            {reports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-plum shadow-md shadow-plum/5 ring-1 ring-plum'
                      : 'bg-white/80 border-lilac/30 hover:border-lavender'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-plum bg-plum/10 px-2 py-0.5 rounded-md">
                      {r.type}
                    </span>
                    <span className="text-xs text-charcoal/40">
                      {new Date(r.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-charcoal">{r.title}</p>
                  <p className="text-xs text-charcoal/50 line-clamp-2 mt-1">{r.summary}</p>
                </button>
              );
            })}
          </div>

          {/* Report Detail View */}
          <div className="lg:col-span-8 print-full-width">
            {selectedReport ? (
              <div className="bg-white rounded-3xl border border-lilac/30 p-8 shadow-sm printable-report-card">
                {/* Print-Only Ritora Clinical Branding Header */}
                <div className="hidden print-only items-center justify-between pb-6 mb-6 border-b border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-plum flex items-center justify-center text-white font-bold text-lg">
                      R
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-charcoal tracking-wide">RITORA</h2>
                      <p className="text-xs text-charcoal/60">Menstrual Health Intelligence • Clinical Summary</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-plum bg-lilac px-2.5 py-1 rounded-md">
                      {selectedReport.type} Report
                    </span>
                    <p className="text-[11px] text-charcoal/50 mt-1">
                      Report ID: #{selectedReport.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Document Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-lilac/20 gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-plum print-hide" />
                      <h3 className="text-xl font-bold text-charcoal">{selectedReport.title}</h3>
                    </div>
                    <p className="text-xs text-charcoal/50">
                      Generated on{' '}
                      {new Date(selectedReport.generatedAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="no-print px-4 py-2 rounded-xl bg-lilac/20 hover:bg-lilac/30 text-charcoal font-medium text-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4 text-plum" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>

                {/* Active Cycle Status Banner */}
                {(selectedReport.data.currentCycleDay || selectedReport.data.activeCycle) && (
                  <div className="mb-6 p-4 rounded-2xl bg-plum/5 border border-plum/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-plum/10 text-plum flex items-center justify-center shrink-0">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-charcoal">
                            Active Cycle: Day {selectedReport.data.activeCycle?.currentCycleDay || selectedReport.data.currentCycleDay}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-plum text-white px-2 py-0.5 rounded-md">
                            {selectedReport.data.activeCycle?.phase || selectedReport.data.cyclePhase || 'LUTEAL'} PHASE
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60 mt-0.5">
                          Status: <span className="font-semibold capitalize">{selectedReport.data.activeCycle?.status || selectedReport.data.cycleStatus || 'Regular'}</span>
                          {(selectedReport.data.deviationDays ?? 0) !== 0 && (
                            <span className="ml-1 text-plum font-semibold">
                              ({(selectedReport.data.deviationDays ?? 0) > 0 ? '+' : ''}{selectedReport.data.deviationDays}d deviation vs baseline)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {selectedReport.data.prediction && (
                      <div className="text-right sm:text-right bg-white/70 px-3 py-1.5 rounded-xl border border-plum/10">
                        <p className="text-[11px] text-charcoal/50">Next Predicted Period</p>
                        <p className="text-xs font-bold text-plum">
                          {new Date(selectedReport.data.prediction.predictedStartDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          <span className="text-[10px] text-charcoal/40 font-normal">
                            ({selectedReport.data.prediction.confidence}% conf)
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Executive Summary */}
                <div className="mb-8 p-5 rounded-2xl bg-lilac/10 border border-lilac/20">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-plum mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Clinical Summary
                  </h5>
                  <p className="text-sm text-charcoal/80 leading-relaxed">{selectedReport.summary}</p>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Calendar className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.cycleCount}</p>
                    <p className="text-[11px] text-charcoal/50">Cycles Tracked</p>
                    {selectedReport.data.completedCyclesCount !== undefined && (
                      <p className="text-[10px] text-charcoal/40 mt-0.5">
                        {selectedReport.data.completedCyclesCount} historical + 1 active
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Activity className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.averageCycleLength}d</p>
                    <p className="text-[11px] text-charcoal/50">Baseline Rhythm</p>
                    {selectedReport.data.baseline?.cycleLengthStdDev !== undefined && (
                      <p className="text-[10px] text-charcoal/40 mt-0.5">
                        ±{Math.round(selectedReport.data.baseline.cycleLengthStdDev)}d variability
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Moon className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.lifestyleAverages.sleep}h</p>
                    <p className="text-[11px] text-charcoal/50">Avg Sleep (7d)</p>
                    <p className="text-[10px] text-charcoal/40 mt-0.5">
                      {selectedReport.data.lifestyleAverages.sleepDeficit ? 'Deficit detected' : 'Within range'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Droplets className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.lifestyleAverages.hydration}L</p>
                    <p className="text-[11px] text-charcoal/50">Avg Daily Water</p>
                    <p className="text-[10px] text-charcoal/40 mt-0.5">
                      {selectedReport.data.lifestyleAverages.hydration >= 2.0 ? 'Meets target' : 'Below target'}
                    </p>
                  </div>
                </div>

                {/* Clinical Risk Screenings Section */}
                {selectedReport.data.riskScreening && selectedReport.data.riskScreening.length > 0 && (
                  <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Active Clinical Risk Screenings
                    </h5>
                    <div className="space-y-3">
                      {selectedReport.data.riskScreening.map((risk, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/90 border border-amber-500/20">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-bold text-charcoal">{risk.type}</span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                risk.level === 'high'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {risk.level} awareness
                            </span>
                          </div>
                          <p className="text-xs text-charcoal/70 mb-2 leading-relaxed">{risk.explanation}</p>
                          {risk.suggestedAction && (
                            <p className="text-xs font-semibold text-plum">
                              Physician Discussion: {risk.suggestedAction}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* "What Changed?" Longitudinal Shifts */}
                {selectedReport.data.whatChanged && selectedReport.data.whatChanged.length > 0 && (
                  <div className="mb-8">
                    <h5 className="text-sm font-bold text-charcoal mb-3 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-plum" />
                      Baseline Comparison ("What Changed?")
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedReport.data.whatChanged.map((shift, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-lilac/10 border border-lilac/20 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-charcoal">{shift.metricName}</p>
                            <p className="text-[11px] text-charcoal/60 mt-0.5">
                              Current: <span className="font-semibold text-charcoal">{shift.recent}</span> vs Baseline: {shift.baseline}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shrink-0 ${
                              shift.direction === 'UP'
                                ? 'bg-amber-100 text-amber-800'
                                : shift.direction === 'DOWN'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-charcoal'
                            }`}
                          >
                            {shift.direction === 'UP' ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {shift.delta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Symptoms Breakdown */}
                <div className="mb-8">
                  <h5 className="text-sm font-bold text-charcoal mb-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-plum" />
                    Top Recorded Symptoms & Longitudinal Recurrence
                  </h5>
                  <div className="space-y-2.5">
                    {selectedReport.data.commonSymptoms.map((sym, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white border border-lilac/20 gap-2"
                      >
                        <div>
                          <span className="text-xs font-bold capitalize text-charcoal">{sym.type}</span>
                          {sym.trendDescription && (
                            <p className="text-[11px] text-charcoal/50 mt-0.5">{sym.trendDescription}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {sym.averageSeverity !== undefined && (
                            <span className="text-[11px] font-medium text-charcoal/70 bg-lilac/20 px-2 py-0.5 rounded-md">
                              {sym.averageSeverity}/5 severity
                            </span>
                          )}
                          {sym.frequency !== undefined && (
                            <span className="text-[11px] font-semibold text-plum bg-plum/10 px-2 py-0.5 rounded-md">
                              {sym.frequency}% cycle recurrence
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations / Discussion Points */}
                {selectedReport.data.recommendations && selectedReport.data.recommendations.length > 0 && (
                  <div className="mb-8 p-5 rounded-2xl bg-white border border-lilac/30 shadow-sm">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-plum mb-3 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-plum" />
                      Clinician Discussion & Lifestyle Support Topics
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedReport.data.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-lilac/10 border border-lilac/20">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-charcoal">{rec.title}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-plum bg-plum/10 px-1.5 py-0.5 rounded">
                              {rec.category}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal/70 leading-relaxed">{rec.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Print-Only Physician Consultation Section */}
                <div className="hidden print-only pt-6 mt-6 border-t border-gray-300">
                  <h6 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                    Physician Consultation Notes
                  </h6>
                  <div className="h-24 border border-dashed border-gray-400 rounded-xl mb-4" />
                  <div className="flex items-center justify-between text-[11px] text-charcoal/60">
                    <span>Clinician Signature: _______________________</span>
                    <span>Date: _______________________</span>
                  </div>
                </div>

                {/* Print Footer / Clinical Disclaimer */}
                <div className="pt-6 mt-6 border-t border-lilac/20 text-[11px] text-charcoal/60 text-center">
                  <p className="font-semibold flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-plum" />
                    RITORA Health Intelligence • Confidential Clinical Summary
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-1 max-w-2xl mx-auto">
                    This document synthesizes user-tracked biometrics, symptom recurrence patterns, and mathematical baseline predictions to facilitate clinical review. It does not constitute a clinical diagnosis or medical directive.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-lilac/30 p-12 text-center text-charcoal/40 no-print">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-plum" />
                <p className="text-sm font-semibold">Select or generate a report to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
