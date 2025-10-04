// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// XML Namespace Constants
// ============================================================================
// W3C Standard Namespace URIs for SVG, MathML, and other XML vocabularies
// ============================================================================

/**
 * W3C Standard XML Namespaces
 * These URIs are W3C standards and unlikely to change, but centralizing
 * them here allows for easier maintenance if specifications evolve.
 */
export const XML_NAMESPACES = {
    // SVG Namespace (Scalable Vector Graphics)
    SVG: 'http://www.w3.org/2000/svg',

    // MathML Namespace (Mathematical Markup Language)
    MATHML: 'http://www.w3.org/1998/Math/MathML',

    // XHTML Namespace (for reference)
    XHTML: 'http://www.w3.org/1999/xhtml',

    // XLink Namespace (for SVG links)
    XLINK: 'http://www.w3.org/1999/xlink',

    // XML Namespace (for xml:lang, etc.)
    XML: 'http://www.w3.org/XML/1998/namespace',

    // XMLNS Namespace (for xmlns attributes)
    XMLNS: 'http://www.w3.org/2000/xmlns/'
};

/**
 * Namespace Source Information
 */
export const NAMESPACE_SOURCES = {
    SVG: 'W3C',
    MATHML: 'W3C',
    XHTML: 'W3C',
    XLINK: 'W3C',
    XML: 'W3C',
    XMLNS: 'W3C'
};

/**
 * Get namespace URI by key
 * @param {string} key - Namespace key (SVG, MATHML, etc.)
 * @returns {string|undefined} Namespace URI or undefined if not found
 */
export function getNamespace(key) {
    return XML_NAMESPACES[key.toUpperCase()];
}

/**
 * Get namespace source by key
 * @param {string} key - Namespace key
 * @returns {string|undefined} Source (W3C) or undefined if not found
 */
export function getNamespaceSource(key) {
    return NAMESPACE_SOURCES[key.toUpperCase()];
}

/**
 * Check if a URI is a known W3C namespace
 * @param {string} uri - Namespace URI to check
 * @returns {boolean} True if URI is a known namespace
 */
export function isKnownNamespace(uri) {
    return Object.values(XML_NAMESPACES).includes(uri);
}

export default XML_NAMESPACES;
