import { SymptomRecord, CycleRecord, SymptomTrendItem, SymptomAnalysisResult } from '../types';

/**
 * Helper to check if a date string falls within a cycle's span
 */
function isDateInCycle(dateStr: string, cycle: CycleRecord, subsequentCycleStart?: string): boolean {
  const date = new Date(dateStr).getTime();
  const start = new Date(cycle.startDate).getTime();

  let end: number;
  if (subsequentCycleStart) {
    end = new Date(subsequentCycleStart).getTime();
  } else if (cycle.cycleLength && cycle.cycleLength > 0) {
    end = start + cycle.cycleLength * 24 * 60 * 60 * 1000;
  } else if (cycle.isActive) {
    end = new Date().getTime();
  } else if (cycle.endDate) {
    // If only bleeding endDate is present, use cycleLength heuristic (e.g. 28 days) or endDate
    end = Math.max(new Date(cycle.endDate).getTime(), start + 28 * 24 * 60 * 60 * 1000);
  } else {
    end = start + 30 * 24 * 60 * 60 * 1000;
  }

  const buffer = 24 * 60 * 60 * 1000;
  return date >= (start - buffer) && date <= (end + buffer);
}

/**
 * Symptom Pattern & Longitudinal Recurrence Engine
 * Computes cross-cycle recurrence ratio (M / N cycles) and severity trajectory.
 */
export function analyzeSymptomPatterns(
  symptoms: SymptomRecord[],
  cycles?: CycleRecord[]
): SymptomAnalysisResult {
  if (!symptoms || symptoms.length === 0) {
    return {
      topSymptoms: [],
      highSeveritySymptoms: [],
      recurringSymptoms: [],
    };
  }

  // 1. Group symptoms by normalized type
  const grouped = new Map<string, SymptomRecord[]>();
  for (const s of symptoms) {
    const key = (s.type || 'unknown').toLowerCase().trim();
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(s);
  }

  const cycleList = (cycles && cycles.length > 0) ? [...cycles] : [];
  // Sort cycles descending by startDate
  cycleList.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const totalCycles = Math.max(1, cycleList.length);

  const trendItems: SymptomTrendItem[] = [];

  for (const [type, entries] of grouped.entries()) {
    // Sort entries chronologically (oldest to newest)
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalSeverity = entries.reduce((sum, e) => sum + (e.severity || 1), 0);
    const averageSeverity = Math.round((totalSeverity / entries.length) * 10) / 10;

    // 2. Compute Cross-Cycle Recurrence (M / N cycles)
    let occurrencesInCycles = 0;
    if (cycleList.length > 0) {
      for (let i = 0; i < cycleList.length; i++) {
        const curCycle = cycleList[i];
        const nextCycleStart = i > 0 ? cycleList[i - 1].startDate : undefined;
        const presentInCycle = entries.some((e) => isDateInCycle(e.date, curCycle, nextCycleStart));
        if (presentInCycle) {
          occurrencesInCycles++;
        }
      }
    } else {
      // Estimate cycle periods via 28-day windowing
      const dates = entries.map((e) => new Date(e.date).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const spanDays = Math.max(1, Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24)));
      const estimatedWindows = Math.max(1, Math.ceil(spanDays / 28));
      occurrencesInCycles = Math.min(entries.length, estimatedWindows);
    }

    const frequency = Math.round((occurrencesInCycles / totalCycles) * 100) / 100;

    // 3. Analyze Severity Trajectory (isIncreasing)
    let isIncreasing = false;
    if (entries.length >= 2) {
      const mid = Math.floor(entries.length / 2);
      const olderHalf = entries.slice(0, mid);
      const newerHalf = entries.slice(mid);

      const olderAvg = olderHalf.reduce((sum, e) => sum + e.severity, 0) / olderHalf.length;
      const newerAvg = newerHalf.reduce((sum, e) => sum + e.severity, 0) / newerHalf.length;

      // Escalation if recent half is at least 0.4 points higher or latest entry >= 4 with delta
      if (newerAvg >= olderAvg + 0.4 || (entries[entries.length - 1].severity >= 4 && newerAvg > olderAvg)) {
        isIncreasing = true;
      }
    }

    // 4. Pattern Classification
    let pattern: 'recurring' | 'occasional' | 'isolated' = 'isolated';
    if (frequency >= 0.5 || occurrencesInCycles >= 2) {
      pattern = 'recurring';
    } else if (frequency >= 0.25 || entries.length >= 2) {
      pattern = 'occasional';
    }

    // Format human-readable trend description
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    let trendDescription = '';
    if (pattern === 'recurring') {
      trendDescription = `${formattedType} has been reported in ${occurrencesInCycles} of ${totalCycles} tracked cycles (${Math.round(frequency * 100)}% recurrence). Severity is ${isIncreasing ? 'trending upward' : 'consistent'}.`;
    } else {
      trendDescription = `${formattedType} reported across recent logs with an average severity of ${averageSeverity}/5.`;
    }

    trendItems.push({
      symptomType: type,
      frequency,
      averageSeverity,
      isIncreasing,
      occurrences: entries.length,
      cyclesAnalyzed: totalCycles,
      pattern,
      trendDescription,
    });
  }

  // 5. Sort Top Symptoms: Prioritize recurring pattern, then high severity, then frequency
  const topSymptoms = [...trendItems].sort((a, b) => {
    const scoreA = (a.frequency * 0.6) + ((a.averageSeverity / 5) * 0.4);
    const scoreB = (b.frequency * 0.6) + ((b.averageSeverity / 5) * 0.4);
    return scoreB - scoreA;
  });

  // 6. High Severity Symptoms: Average severity >= 3.5 or recurring high severity
  const highSeveritySymptoms = trendItems
    .filter((t) => t.averageSeverity >= 3.5 || (t.isIncreasing && t.averageSeverity >= 3.0))
    .sort((a, b) => b.averageSeverity - a.averageSeverity);

  // 7. Recurring Symptoms: Recurrence ratio >= 50%
  const recurringSymptoms = trendItems
    .filter((t) => t.pattern === 'recurring')
    .sort((a, b) => b.frequency - a.frequency);

  return {
    topSymptoms: topSymptoms.slice(0, 5),
    highSeveritySymptoms,
    recurringSymptoms,
  };
}
