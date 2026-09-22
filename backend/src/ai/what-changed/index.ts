import { UserHealthSnapshot, BaselineResult, WhatChangedResult } from '../types';

/**
 * What Changed Engine Stub
 * To be implemented by AI engineer.
 */
export function analyzeWhatChanged(
  snapshot: UserHealthSnapshot,
  baseline: BaselineResult
): WhatChangedResult {
  return {
    hasSignificantChanges: false,
    changes: [],
  };
}
