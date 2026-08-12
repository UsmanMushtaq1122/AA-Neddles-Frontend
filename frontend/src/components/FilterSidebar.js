'use client';

import { useMemo } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FALLBACK_PRICE_RANGES = [
  { label: 'Under 5,000', min: null, max: 5000 },
  { label: '5,000 - 10,000', min: 5000, max: 10000 },
  { label: '10,000 - 20,000', min: 10000, max: 20000 },
  { label: '20,000+', min: 20000, max: null },
];

const fallbackSizes = ['XS', 'S', 'M', 'L', 'XL'];
const fallbackFabrics = ['Cotton', 'Lawn', 'Chiffon', 'Silk', 'Velvet', 'Cambric'];

function normalizeOptions(values, key = 'label') {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => {
      if (typeof value === 'string') return { label: value, value };
      if (value && typeof value === 'object') {
        const label = value.label || value.name || value[key];
        const normalizedValue = value.value || value.slug || value.id || label;
        if (!label || !normalizedValue) return null;
        return { label, value: normalizedValue };
      }
      return null;
    })
    .filter(Boolean);
}

function CheckboxList({ title, options, selected, onToggle }) {
  if (!options.length) return null;

  return (
    <div className="border-t border-zinc-100 pt-4">
      <h3 className="mb-3 text-sm font-semibold text-noor-black">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                className="h-4 w-4 rounded border-zinc-300 text-noor-maroon focus:ring-noor-maroon"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  setFilters,
  facets,
}) {
  const priceRanges = facets?.priceRanges?.length ? facets.priceRanges : FALLBACK_PRICE_RANGES;
  const sizeOptions = useMemo(
    () => normalizeOptions(facets?.sizes?.length ? facets.sizes : fallbackSizes),
    [facets]
  );
  const fabricOptions = useMemo(
    () => normalizeOptions(facets?.fabrics?.length ? facets.fabrics : fallbackFabrics),
    [facets]
  );
  const collectionOptions = useMemo(
    () => normalizeOptions(facets?.collections || []),
    [facets]
  );

  const selectedPrice = filters.price || [];
  const selectedSizes = filters.size || [];
  const selectedFabrics = filters.fabric || [];
  const selectedCollections = filters.collection || [];

  const toggleFilterValue = (key, value) => {
    setFilters((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      const nextFilters = { ...prev, [key]: next };
      if (next.length === 0) delete nextFilters[key];
      return nextFilters;
    });
  };

  const clearAll = () => setFilters({});

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close filters"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] overflow-y-auto border-r border-zinc-200 bg-white p-5 shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-noor-black">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors"
            aria-label="Close filter panel"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-noor-black">Price</h3>
              <button type="button" className="text-xs text-noor-maroon hover:underline" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <div className="space-y-2">
              {priceRanges.map((range) => {
                const isChecked = selectedPrice.includes(range.label);
                return (
                  <label key={range.label} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-600">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFilterValue('price', range.label)}
                      className="h-4 w-4 rounded border-zinc-300 text-noor-maroon focus:ring-noor-maroon"
                    />
                    <span>{range.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <CheckboxList title="Size" options={sizeOptions} selected={selectedSizes} onToggle={(value) => toggleFilterValue('size', value)} />
          <CheckboxList title="Fabric" options={fabricOptions} selected={selectedFabrics} onToggle={(value) => toggleFilterValue('fabric', value)} />
          <CheckboxList title="Collection" options={collectionOptions} selected={selectedCollections} onToggle={(value) => toggleFilterValue('collection', value)} />
        </div>

        <div className="mt-6 border-t border-zinc-100 pt-4 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-noor-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-noor-black/90"
          >
            <ChevronDown size={16} className="rotate-90" />
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}