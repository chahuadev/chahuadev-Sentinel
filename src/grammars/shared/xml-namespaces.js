//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// XML Namespaces Configuration for JSX Grammar
// ============================================================================

/**
 * XML Namespaces for JSX/React components
 */
export const XML_NAMESPACES = {
    // React specific namespaces
    react: {
        prefix: 'react',
        uri: 'http://www.facebook.com/jsx',
        elements: ['Fragment', 'StrictMode', 'Suspense', 'Profiler']
    },
    
    // HTML5 standard elements
    html: {
        prefix: 'html',
        uri: 'http://www.w3.org/1999/xhtml',
        elements: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                  'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 
                  'button', 'a', 'img', 'video', 'audio', 'canvas', 'svg']
    },
    
    // SVG elements
    svg: {
        prefix: 'svg',
        uri: 'http://www.w3.org/2000/svg',
        elements: ['svg', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 
                  'ellipse', 'text', 'g', 'defs', 'use', 'symbol', 'marker']
    },
    
    // Custom component namespace
    custom: {
        prefix: 'custom',
        uri: 'custom://components',
        elements: [] // Will be populated dynamically
    }
};

/**
 * Namespace sources and their priority
 */
export const NAMESPACE_SOURCES = {
    react: {
        priority: 1,
        source: 'React',
        description: 'React built-in components'
    },
    html: {
        priority: 2,
        source: 'HTML5',
        description: 'Standard HTML elements'
    },
    svg: {
        priority: 3,
        source: 'SVG',
        description: 'SVG vector graphics elements'
    },
    custom: {
        priority: 4,
        source: 'Custom',
        description: 'User-defined custom components'
    }
};

/**
 * Get namespace for an element name
 * @param {string} elementName - The element name to look up
 * @returns {object|null} Namespace object or null if not found
 */
export function getNamespaceForElement(elementName) {
    for (const [namespaceName, namespace] of Object.entries(XML_NAMESPACES)) {
        if (namespace.elements.includes(elementName)) {
            return {
                name: namespaceName,
                ...namespace,
                source: NAMESPACE_SOURCES[namespaceName]
            };
        }
    }
    return null;
}

/**
 * Check if element name is a custom component (starts with uppercase)
 * @param {string} elementName - The element name to check
 * @returns {boolean} True if it's a custom component
 */
export function isCustomComponent(elementName) {
    return /^[A-Z]/.test(elementName);
}

/**
 * Validate JSX element name
 * @param {string} elementName - The element name to validate
 * @returns {object} Validation result
 */
export function validateJSXElement(elementName) {
    const namespace = getNamespaceForElement(elementName);
    const isCustom = isCustomComponent(elementName);
    
    return {
        isValid: namespace !== null || isCustom,
        namespace: namespace,
        isCustomComponent: isCustom,
        elementName: elementName
    };
}

export default {
    XML_NAMESPACES,
    NAMESPACE_SOURCES,
    getNamespaceForElement,
    isCustomComponent,
    validateJSXElement
};
