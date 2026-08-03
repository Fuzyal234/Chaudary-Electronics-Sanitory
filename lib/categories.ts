import { categories } from '@/data/categories';
import { Product } from '@/types';

/**
 * Products are tagged with fine-grained shelf labels — 'Toilets', 'Basins',
 * 'CPVC Pipes' — while the storefront navigates by department. This module is
 * the single place that maps one to the other, so a department's badge count
 * and the products its page actually lists can never disagree.
 *
 * Every label below belongs to exactly one department. Adding a new label here
 * is all that is needed to file a new kind of product.
 */
const DEPARTMENT_LABELS: Record<string, string[]> = {
  sanitary: ['sanitary', 'sanitary ware', 'toilets', 'wash basins', 'basins', 'bathtubs', 'urinals', 'bidets'],
  electric: [
    'electric', 'electric items', 'electrical', 'cables', 'cables & wires', 'circuit breakers',
    'contactors', 'distribution boards', 'transformers', 'motor starters', 'terminal blocks',
    'enclosures', 'conduit & trunking', 'cable accessories', 'back boxes', 'voltage stabilizers',
    'timers', 'sensors', 'batteries', 'smart devices', 'power strips', 'fans',
  ],
  lighting: ['lighting', 'led lighting', 'led bulbs', 'led strips', 'panel lights', 'spotlights', 'flood lights', 'street lights'],
  bathroom: ['bathroom', 'showers', 'faucets', 'accessories'],
  pipes: ['pipes', 'pipes & fittings', 'cpvc pipes', 'valves', 'fittings'],
  switches: ['switches', 'switches & sockets', 'sockets', 'switch plates'],
  'water-pumps': ['water pumps', 'jet pumps', 'booster pumps'],
  'water-tanks': ['water tanks', 'poly tanks'],
  geysers: ['geysers', 'electric geysers', 'gas geysers'],
  hardware: ['hardware'],
  plumbing: ['plumbing'],
  tools: ['tools', 'power tools', 'hand tools', 'electrical tools', 'test & measurement', 'soldering'],
  paint: ['paint', 'paint accessories', 'rollers', 'brushes'],
  kitchen: ['kitchen', 'sinks'],
  construction: ['construction', 'waterproofing', 'cement', 'adhesives'],
  safety: ['safety', 'safety equipment', 'head protection', 'eye protection', 'gloves'],
  fasteners: ['fasteners', 'bolts & nuts', 'screws', 'anchors'],
  'door-hardware': ['door hardware', 'door locks', 'hinges', 'handles'],
};

/** label → department slug, built once. */
const labelToSlug = new Map<string, string>();
for (const [slug, labels] of Object.entries(DEPARTMENT_LABELS)) {
  for (const label of labels) labelToSlug.set(label, slug);
}

/** A department's own name and slug always match it, so a catalog row typed by
 *  hand in the admin panel ("Sanitary Ware") files itself correctly. */
for (const c of categories) {
  labelToSlug.set(c.name.toLowerCase(), c.slug);
  labelToSlug.set(c.slug.toLowerCase(), c.slug);
}

const norm = (v: string | undefined) => v?.trim().toLowerCase() ?? '';

/**
 * Which department a product belongs to, or undefined if nothing claims it.
 * `category` wins; `subcategory` is the fallback, which catches rows whose
 * category is a broad word but whose subcategory is specific.
 */
export function departmentOf(product: Product): string | undefined {
  return labelToSlug.get(norm(product.category)) ?? labelToSlug.get(norm(product.subcategory));
}

/** Every product filed under a department, matched by slug or by display name. */
export function productsInDepartment(products: Product[], slugOrName: string): Product[] {
  const slug = labelToSlug.get(norm(slugOrName)) ?? norm(slugOrName);
  return products.filter((p) => departmentOf(p) === slug);
}

/**
 * Live product count per department slug. Counting once and reading the map is
 * what keeps the nav, the footer, the home grid and the department page from
 * drifting apart as the catalog changes.
 */
export function countByDepartment(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of categories) counts[c.slug] = 0;
  for (const p of products) {
    const slug = departmentOf(p);
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

/** Products the label map does not claim — a maintenance aid, not UI copy. */
export function unfiledProducts(products: Product[]): Product[] {
  return products.filter((p) => !departmentOf(p));
}
