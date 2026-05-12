// Single source of truth for resolving a product's image URL.
// Backend returns image_url as a relative path (/static/images/{slug}.jpg)
// which Vite proxy forwards to http://localhost:8001.
export function getProductImageUrl(product) {
  return product?.image_url || product?.image || null;
}
