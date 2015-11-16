/* Copyright 2015 Realm Inc - All Rights Reserved
 * Proprietary and Confidential
 */

'use strict';

module.exports = {
    assertEqual: function(val1, val2, errorMessage) {
        if (val1 !== val2) {
            var message = "'" + val1 + "' does not equal expected value '" + val2 + "'";
            if (errorMessage) {
                message = errorMessage + "\n" + message;
            }
            throw new TestFailureError(message);
        }
    },

    assertNotEqual: function(val1, val2, errorMessage) {
        if (val1 === val2) {
            var message = "'" + val1 + "' equals '" + val2 + "'";
            if (errorMessage) {
                message = errorMessage + "\n" + message;
            }
            throw new TestFailureError(message);
        }
    },

    assertEqualWithTolerance: function(val1, val2, tolerance, errorMessage) {
        if (val1 < val2 - tolerance || val1 > val2 + tolerance) {
            var message = "'" + val1 + "' does not equal '" + val2 + "' with tolerance '" + tolerance + "'";
            if (errorMessage) {
                message = errorMessage + "\n" + message;
            }
            throw new TestFailureError(message);
        }
    },

    assertArraysEqual: function(val1, val2, errorMessage) {
        if (val1.length !== val2.length) {
            throw new TestFailureError(errorMessage || 'Arrays have different lengths');
        }

        for (var i = 0, len = val1.length; i < len; i++) {
            if (val1[i] !== val2[i]) {
                throw new TestFailureError(errorMessage || 'Array contents are not equal');
            }
        }
    },

    assertThrows: function(func, errorMessage) {
        var caught = false;
        try {
            func();
        }
        catch (e) {
            caught = true;
        }

        if (!caught) {
            throw new TestFailureError(errorMessage || 'Expected exception not thrown');
        }
    },

    assertTrue: function(condition, errorMessage) {
        if (!condition) {
            throw new TestFailureError(errorMessage || 'Condition expected to be true');
        }
    },
};

function TestFailureError(message) {
    var error;
    try {
        throw new Error(message);
    } catch (e) {
        error = e;
    }

    // This regular expression will match stack trace lines provided by JavaScriptCore.
    // Example: someMethod@file:///path/to/file.js:10:24
    var regex = /^(?:.*?@)?([^\[\(].+?):(\d+)(?::(\d+))?\s*$/;

    // Remove the top two stack frames and use information from the third, if possible.
    var stack = error.stack && error.stack.split('\n');
    var match = stack[2] && stack[2].match(regex);
    if (match) {
        this.sourceURL = match[1];
        this.line = +match[2];
        this.column = +match[3];
        this.stack = stack.slice(2).join('\n');
    }

    this.__proto__ = error;
}
