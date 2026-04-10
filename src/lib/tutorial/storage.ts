export const TUTORIAL_SEEN_STORAGE_KEY = 'hasSeenTutorial';
export const TUTORIAL_SEEN_STORAGE_VALUE = 'true';

let hasSeenTutorialInMemory = false;

export function hasSeenTutorial(): boolean {
  if (hasSeenTutorialInMemory) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return (
      window.localStorage.getItem(TUTORIAL_SEEN_STORAGE_KEY) ===
      TUTORIAL_SEEN_STORAGE_VALUE
    );
  } catch {
    return false;
  }
}

export function markTutorialAsSeen(): void {
  hasSeenTutorialInMemory = true;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      TUTORIAL_SEEN_STORAGE_KEY,
      TUTORIAL_SEEN_STORAGE_VALUE
    );
  } catch {
    // Ignore storage failures so users can still leave the tutorial.
  }
}
