/**
 * This function is there to ensure we can reconcile the URLs with slim different.
 * Like:
 * - https://tenor.com/fr/view/aucuneexpression-gif-5576995 === https://tenor.com/fr//view////aucuneexpression-gif-5576995
 * - https://img.shields.io/badge/demo-value-green?style=plastic&color=blue === https://img.shields.io/badge/demo-value-green?color=blue&style=plastic
 * So we make sure to edit the URL to made it able to be stringified always the same way.
 */
export function sanitizeUrl(url: URL): void {
  url.pathname = url.pathname.replaceAll(/\/+/g, "/");
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
  }

  const entries = [...url.searchParams.entries()].sort(([keyA, valueA], [keyB, valueB]) => {
    if (keyA === keyB) {
      return valueA.localeCompare(valueB);
    } else {
      return keyA.localeCompare(keyB);
    }
  });
  url.search = "";
  for (const [key, value] of entries) {
    url.searchParams.append(key, value);
  }
}
