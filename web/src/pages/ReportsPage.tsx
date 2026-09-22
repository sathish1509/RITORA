import { useState, useEffect } from 'react';
import TopNav from '../components/layout/TopNav';
import { reportService } from '../services/reportService';
import type { Report } from '../types';
import { FileText, Download, Plus, Calendar, Activity, Moon, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportType, setReportType] = useState<'monthly' | 'quarterly' | 'annual' | 'custom'>('quarterly');
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
              Exports cycle variability, symptom clusters, and lifestyle correlations
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl bg-lilac/15 border border-lilac/30 text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-lavender"
            >
              <option value="monthly">Monthly Summary</option>
              <option value="quarterly">Quarterly Overview (Recommended)</option>
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
              <span>{generating ? 'Compiling...' : 'Generate'}</span>
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
                      <p className="text-xs text-charcoal/60">Menstrual Health Intelligence • Clinical Record</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-plum bg-lilac px-2.5 py-1 rounded-md">
                      {selectedReport.type} Report
                    </span>
                    <p className="text-[11px] text-charcoal/50 mt-1">
                      ID: #{selectedReport.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-lilac/20 gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-plum print-hide" />
                      <h3 className="text-xl font-bold text-charcoal">{selectedReport.title}</h3>
                    </div>
                    <p className="text-xs text-charcoal/50">
                      Generated on {new Date(selectedReport.generatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                    <p className="text-[11px] text-charcoal/50">Cycles Logged</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Activity className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.averageCycleLength}d</p>
                    <p className="text-[11px] text-charcoal/50">Avg Cycle Length</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Moon className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.lifestyleAverages.sleep}h</p>
                    <p className="text-[11px] text-charcoal/50">Avg Sleep</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-lilac/15 border border-lilac/20 text-center">
                    <Droplets className="w-4 h-4 text-plum mx-auto mb-1" />
                    <p className="text-xl font-bold text-charcoal">{selectedReport.data.lifestyleAverages.hydration}L</p>
                    <p className="text-[11px] text-charcoal/50">Avg Water Intake</p>
                  </div>
                </div>

                {/* Common Symptoms Breakdown */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-charcoal mb-3">Top Recorded Symptoms</h5>
                  <div className="space-y-2.5">
                    {selectedReport.data.commonSymptoms.map((sym, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-lilac/20">
                        <span className="text-xs font-semibold capitalize text-charcoal">{sym.type}</span>
                        <span className="text-xs font-medium text-plum bg-plum/10 px-2 py-0.5 rounded-md">
                          {sym.count} logged occurrences
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Print Footer / Clinical Disclaimer */}
                <div className="hidden print-only pt-6 mt-6 border-t border-gray-300 text-[11px] text-charcoal/60 text-center">
                  <p className="font-semibold">RITORA Health Intelligence • Confidential Clinical Summary</p>
                  <p className="text-[10px] text-charcoal/40 mt-0.5">
                    This document summarizes user-logged biometric and symptom patterns for healthcare provider review and does not constitute a medical diagnosis.
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
