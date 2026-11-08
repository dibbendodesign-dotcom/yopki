"use client";

import { useSyncExternalStore } from "react";

/**
 * The answers collected across the trip steps. Each step saves its part when you press its
 * Continue / Build button; the build animation on the last step reads it all back.
 * PROVISIONAL — kept in sessionStorage (this tab only) until there's a backend to send it to.
 */
export type TripDraft = {
  cities?: string[];
  tripType?: "solo" | "partner" | "family";
  adults?: number;
  children?: number;
  /** Ready-made summary from the Dates step, e.g. "7 days in December" or "Nov 12 – Nov 18 · 6 nights". */
  when?: string;
  mustDos?: string[];
  mustAvoids?: string[];
};

const STORAGE_KEY = "yopki:trip-draft";
const EMPTY: TripDraft = {};

let draft: TripDraft | null = null;
const listeners = new Set<() => void>();

function read(): TripDraft {
  if (draft) return draft;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    draft = raw ? (JSON.parse(raw) as TripDraft) : EMPTY;
  } catch {
    draft = EMPTY;
  }
  return draft;
}

/** Merge a step's answers into the draft. */
export function saveTripDraft(patch: Partial<TripDraft>) {
  draft = { ...read(), ...patch };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage blocked (private mode etc.) — the draft still lives in memory for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The current draft; empty on the server and during hydration. */
export function useTripDraft(): TripDraft {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
