'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getMarketingConsentChoice,
  setMarketingConsent,
  subscribeToMarketingConsentChoice,
  subscribeToMarketingPreferences,
} from '@/lib/meta-pixel';

export default function MarketingConsent() {
  const choice = useSyncExternalStore(
    subscribeToMarketingConsentChoice,
    getMarketingConsentChoice,
    () => undefined
  );
  const [open, setOpen] = useState(false);
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    return subscribeToMarketingPreferences(() => setOpen(true));
  }, []);

  if (choice === undefined || !pixelId || !/^\d+$/.test(pixelId) || (choice && !open)) return null;

  const saveChoice = (granted) => {
    if (!setMarketingConsent(granted)) return;
    setOpen(false);
  };

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[120] border-t border-zinc-200 bg-white px-4 py-4 shadow-lg"
      aria-label="Marketing cookie preferences"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-sm text-zinc-700">
          Allow marketing cookies to measure visits and improve our advertising. You can change this choice anytime in Cookie Settings.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => saveChoice(false)}
            className="rounded border border-zinc-300 px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => saveChoice(true)}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Allow marketing
          </button>
        </div>
      </div>
    </aside>
  );
}
