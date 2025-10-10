// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https:// ! github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================
// !  ChahuadevR Engine Grammar Dictionary - Core Language Support
// !  ============================================================================
// !  Trie (Prefix Tree) Implementation
// !  โครงสร้างข้อมูลสำหรับค้นหา Longest Match และ Prefix Search
// !  ============================================================================
// !  ใช้สำหรับ:
// !  - Tokenizer: ค้นหา operators หลายตัวอักษร (!==, !=, !)
// !  - Auto-completion: แนะนำคำตาม prefix
// !  - Longest Match: หาคำที่ยาวที่สุดที่ตรงกัน
// !  ============================================================================
// !  Time Complexity:
// !  - Insert: O(m) where m = length of word
// !  - Search: O(m)
// !  - Prefix Search: O(m + n) where n = number of matches
// !  - Longest Match: O(m)
// !  ============================================================================

import errorHandler from '../../error-handler/ErrorHandler.js';



export class TrieNode {
    constructor() {
        /** @type {Map<string, TrieNode>} */
        this.children = new Map();

        /** @type {boolean} - Is this the end of a valid word? */
        this.isEndOfWord = false;

        /** @type {any} - Data associated with this word */
        this.data = null;

        /** @type {string|null} - The complete word at this node */
        this.word = null;
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();

        /** @type {number} - Total number of words in trie */
        this.size = 0;
    }

    /**
     * ! Insert a word into the trie
     * ! @param {string} word - The word to insert
     * ! @param {any} data - Associated data (grammar metadata)
     */
    insert(word, data = null) {
        let current = this.root;

        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }

        if (!current.isEndOfWord) {
            this.size++;
        }

        current.isEndOfWord = true;
        current.data = data;
        current.word = word;
    }

    /**
     * ! Search for a word in the trie
     * ! @param {string} word - The word to search
     * ! @returns {any|undefined} - Associated data if found, undefined otherwise
     */
    search(word) {
        const node = this._searchNode(word);
        // !  NO_SILENT_FALLBACKS: คืน undefined แทน null (JavaScript convention)
        return node?.isEndOfWord ? node.data : undefined;
    }

    /**
     * ! Check if a word exists in the trie
     * ! @param {string} word - The word to check
     * ! @returns {boolean}
     */
    has(word) {
        const node = this._searchNode(word);
        return node?.isEndOfWord ?? false;
    }

    /**
     * ! Find the longest match from the beginning of input
     * ! **Core algorithm for Tokenizer**
     * ! 
     * ! Example: Input "!=="
     * ! - Checks: "!" (match), "!=" (match), "!==" (match)
     * ! - Returns: "!==" (longest match)
     * ! 
     * ! @param {string} input - Input string to match
     * ! @param {number} startIndex - Start position in input
     * ! @returns {{word: string, data: any, length: number}|null}
     */
    findLongestMatch(input, startIndex = 0) {
        let current = this.root;
        let lastMatch = null;
        let position = startIndex;

        while (position < input.length) {
            const char = input[position];

            if (!current.children.has(char)) {
                break; // !  No more matches
            }

            current = current.children.get(char);
            position++;

            // !  If this is a valid word, save it as potential match
            if (current.isEndOfWord) {
                lastMatch = {
                    word: current.word,
                    data: current.data,
                    length: position - startIndex
                };
            }
        }

        return lastMatch;
    }

    /**
     * ! Find all words with a given prefix
     * ! @param {string} prefix - The prefix to search
     * ! @returns {Array<{word: string, data: any}>}
     */
    findWordsWithPrefix(prefix) {
        const node = this._searchNode(prefix);
        if (!node) return [];

        const results = [];
        this._collectWords(node, prefix, results);
        return results;
    }

    /**
     * ! Get all words in the trie
     * ! @returns {Array<{word: string, data: any}>}
     */
    getAllWords() {
        const results = [];
        this._collectWords(this.root, '', results);
        return results;
    }

    /**
     * ! Delete a word from the trie
     * ! @param {string} word - The word to delete
     * ! @returns {boolean} - True if deleted, false if not found
     */
    delete(word) {
        const deleted = this._deleteRecursive(this.root, word, 0);
        if (deleted) {
            this.size--;
        }
        return deleted;
    }

    /**
     * ! Clear all words from the trie
     */
    clear() {
        this.root = new TrieNode();
        this.size = 0;
    }

    // !  ============================================================================
    // !  Private Helper Methods
    // !  ============================================================================

    /**
     * ! Search for a node corresponding to a word
     * ! @private
     */
    _searchNode(word) {
        let current = this.root;

        for (const char of word) {
            if (!current.children.has(char)) {
                return null;
            }
            current = current.children.get(char);
        }

        return current;
    }

    /**
     * ! Recursively collect all words from a node
     * ! @private
     */
    _collectWords(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push({
                word: node.word || prefix,
                data: node.data
            });
        }

        for (const [char, childNode] of node.children) {
            this._collectWords(childNode, prefix + char, results);
        }
    }

    /**
     * ! Recursively delete a word
     * ! @private
     */
    _deleteRecursive(current, word, index) {
        if (index === word.length) {
            if (!current.isEndOfWord) {
                return false; // !  Word not found
            }
            current.isEndOfWord = false;
            current.data = null;
            current.word = null;
            return current.children.size === 0; // !  Can delete if no children
        }

        const char = word[index];
        const node = current.children.get(char);

        if (!node) {
            return false; // !  Word not found
        }

        const shouldDeleteChild = this._deleteRecursive(node, word, index + 1);

        if (shouldDeleteChild) {
            current.children.delete(char);
            return current.children.size === 0 && !current.isEndOfWord;
        }

        return false;
    }

    // !  ============================================================================
    // !  Statistics & Debugging
    // !  ============================================================================

    /**
     * ! Get statistics about the trie
     * ! @returns {{size: number, height: number, nodes: number}}
     */
    getStats() {
        let nodes = 0;
        let maxHeight = 0;

        const traverse = (node, depth) => {
            nodes++;
            maxHeight = Math.max(maxHeight, depth);

            for (const child of node.children.values()) {
                traverse(child, depth + 1);
            }
        };

        traverse(this.root, 0);

        return {
            size: this.size,
            height: maxHeight,
            nodes
        };
    }

    /**
     * ! Visualize the trie structure (for debugging)
     * ! @returns {string}
     */
    visualize() {
        const lines = [];

        const traverse = (node, prefix, isLast, depth) => {
            const entries = Array.from(node.children.entries());

            for (let i = 0; i < entries.length; i++) {
                const [char, childNode] = entries[i];
                const isLastChild = i === entries.length - 1;

                const connector = isLastChild ? '└─' : '├─';
                const extension = isLastChild ? '  ' : '│ ';

                const marker = childNode.isEndOfWord ? '[WORD]' : '[NODE]';
                const word = childNode.isEndOfWord ? ` [${childNode.word}]` : '';

                lines.push(`${prefix}${connector}${marker} ${char}${word}`);
                traverse(childNode, prefix + extension, isLastChild, depth + 1);
            }
        };

        lines.push('Root');
        traverse(this.root, '', true, 0);

        return lines.join('\n');
    }
}

export default Trie;
