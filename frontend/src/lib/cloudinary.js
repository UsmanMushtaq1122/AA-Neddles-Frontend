/**
 * Cloudinary image URL utilities for AA Needles storefront.
 *
 * All transformations use Cloudinary's URL-based API so they work even when
 * Next.js image optimization is enabled (the two systems are complementary:
 * Cloudinary handles format/quality, Next.js adds responsive srcset).
 *
 * IMPORTANT:  We deliberately avoid c_fill / g_auto on product and banner
 * images because that crops fashion photography unexpectedly. Instead we use
 * c_limit (scale down only, never crop) which preserves the full composition.
 */

const CLOUDINARY_BASE = 'res.cloudinary.com';

/**
 * Returns true when the URL points to Cloudinary.
 */
export function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes(CLOUDINARY_BASE);
}

/**
 * Strips any existing Cloudinary transformation block from a URL so we can
 * inject a fresh one.  Handles both /upload/v123… and /upload/f_auto,q_auto/v123… forms.
 */
function stripTransformations(url) {
  // Match /upload/ followed by a comma-separated list of transformation params,
  // then a slash, then the rest of the path.  Transformation params contain
  // only letters, digits, underscores, hyphens, dots, and commas.
  return url.replace(
    /\/upload\/[a-zA-Z0-9_,.\-]+(?=\/v?\d)/,
    '/upload'
  );
}

/**
 * Inject Cloudinary transformations into a Cloudinary URL.
 *
 * @param {string} url     – original Cloudinary URL (may already have transforms)
 * @param {string} params  – Cloudinary transformation string, e.g. "f_auto,q_auto:best"
 * @returns {string}       – URL with transformations applied
 */
function withTransform(url, params) {
  if (!isCloudinaryUrl(url)) return url;
  const clean = stripTransformations(url);
  return clean.replace('/upload/', `/upload/${params}/`);
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/**
 * Hero / full-viewport banners.
 * • f_auto  → WebP on modern browsers, JPEG fallback
 * • q_auto:best → maximum quality, Cloudinary picks the optimal level
 * • c_limit → scale down to fit, never crop, never upscale
 * • w_1920  → deliver at most 1920 px wide (retina = 2× CSS px / 2 = fine)
 */
export function heroImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:best,c_limit,w_1920');
}

/**
 * Mobile hero / portrait banners (≤768 px viewport).
 * Narrower max-width keeps payload small on phones.
 */
export function heroMobileImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:best,c_limit,w_900');
}

/**
 * Product card thumbnails in listing / carousel contexts.
 * 800 px is enough for a 4-up grid on a 1920 px display at 2× DPR.
 */
export function productCardImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:best,c_limit,w_800');
}

/**
 * Main product gallery images on the product detail page.
 * Served at up to 1200 px so they look sharp on Retina laptops.
 */
export function productGalleryImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:best,c_limit,w_1200');
}

/**
 * Product thumbnail strip (small buttons beside the gallery).
 */
export function productThumbImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:good,c_limit,w_200');
}

/**
 * Category / collection cards.
 */
export function categoryImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:best,c_limit,w_900');
}

/**
 * Testimonial / customer photos.
 */
export function testimonialImageUrl(url) {
  return withTransform(url, 'f_auto,q_auto:good,c_limit,w_600');
}

/**
 * Generic "auto" preset – good default when no specific context is known.
 */
export function autoImageUrl(url) {
  if (!url) return url;
  if (!isCloudinaryUrl(url)) return url;
  // If the URL already has a transformation block, leave it alone.
  if (/\/upload\/[a-zA-Z]/.test(url.replace('/upload/v', ''))) return url;
  return withTransform(url, 'f_auto,q_auto:best');
}

