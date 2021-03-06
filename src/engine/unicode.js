/*
* Copyright (c) 2014 MKLab. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*
*/

/**
 * @private
 * Unicode Character Ranges
 * http://jrgraphix.net/research/unicode_blocks.php
 */
var UNICODE_RANGES = [
  [0x0020, 0x007F, 'Basic Latin'],
  [0x00A0, 0x00FF, 'Latin-1 Supplement'],
  [0x0100, 0x017F, 'Latin Extended-A'],
  [0x0180, 0x024F, 'Latin Extended-B'],
  [0x0250, 0x02AF, 'IPA Extensions'],
  [0x02B0, 0x02FF, 'Spacing Modifier Letters'],
  [0x0300, 0x036F, 'Combining Diacritical Marks'],
  [0x0370, 0x03FF, 'Greek and Coptic'],
  [0x0400, 0x04FF, 'Cyrillic'],
  [0x0500, 0x052F, 'Cyrillic Supplementary'],
  [0x0530, 0x058F, 'Armenian'],
  [0x0590, 0x05FF, 'Hebrew'],
  [0x0600, 0x06FF, 'Arabic'],
  [0x0700, 0x074F, 'Syriac'],
  [0x0780, 0x07BF, 'Thaana'],
  [0x0900, 0x097F, 'Devanagari'],
  [0x0980, 0x09FF, 'Bengali'],
  [0x0A00, 0x0A7F, 'Gurmukhi'],
  [0x0A80, 0x0AFF, 'Gujarati'],
  [0x0B00, 0x0B7F, 'Oriya'],
  [0x0B80, 0x0BFF, 'Tamil'],
  [0x0C00, 0x0C7F, 'Telugu'],
  [0x0C80, 0x0CFF, 'Kannada'],
  [0x0D00, 0x0D7F, 'Malayalam'],
  [0x0D80, 0x0DFF, 'Sinhala'],
  [0x0E00, 0x0E7F, 'Thai'],
  [0x0E80, 0x0EFF, 'Lao'],
  [0x0F00, 0x0FFF, 'Tibetan'],
  [0x1000, 0x109F, 'Myanmar'],
  [0x10A0, 0x10FF, 'Georgian'],
  [0x1100, 0x11FF, 'Hangul Jamo'],
  [0x1200, 0x137F, 'Ethiopic'],
  [0x13A0, 0x13FF, 'Cherokee'],
  [0x1400, 0x167F, 'Unified Canadian Aboriginal Syllabics'],
  [0x1680, 0x169F, 'Ogham'],
  [0x16A0, 0x16FF, 'Runic'],
  [0x1700, 0x171F, 'Tagalog'],
  [0x1720, 0x173F, 'Hanunoo'],
  [0x1740, 0x175F, 'Buhid'],
  [0x1760, 0x177F, 'Tagbanwa'],
  [0x1780, 0x17FF, 'Khmer'],
  [0x1800, 0x18AF, 'Mongolian'],
  [0x1900, 0x194F, 'Limbu'],
  [0x1950, 0x197F, 'Tai Le'],
  [0x19E0, 0x19FF, 'Khmer Symbols'],
  [0x1D00, 0x1D7F, 'Phonetic Extensions'],
  [0x1E00, 0x1EFF, 'Latin Extended Additional'],
  [0x1F00, 0x1FFF, 'Greek Extended'],
  [0x2000, 0x206F, 'General Punctuation'],
  [0x2070, 0x209F, 'Superscripts and Subscripts'],
  [0x20A0, 0x20CF, 'Currency Symbols'],
  [0x20D0, 0x20FF, 'Combining Diacritical Marks for Symbols'],
  [0x2100, 0x214F, 'Letterlike Symbols'],
  [0x2150, 0x218F, 'Number Forms'],
  [0x2190, 0x21FF, 'Arrows'],
  [0x2200, 0x22FF, 'Mathematical Operators'],
  [0x2300, 0x23FF, 'Miscellaneous Technical'],
  [0x2400, 0x243F, 'Control Pictures'],
  [0x2440, 0x245F, 'Optical Character Recognition'],
  [0x2460, 0x24FF, 'Enclosed Alphanumerics'],
  [0x2500, 0x257F, 'Box Drawing'],
  [0x2580, 0x259F, 'Block Elements'],
  [0x25A0, 0x25FF, 'Geometric Shapes'],
  [0x2600, 0x26FF, 'Miscellaneous Symbols'],
  [0x2700, 0x27BF, 'Dingbats'],
  [0x27C0, 0x27EF, 'Miscellaneous Mathematical Symbols-A'],
  [0x27F0, 0x27FF, 'Supplemental Arrows-A'],
  [0x2800, 0x28FF, 'Braille Patterns'],
  [0x2900, 0x297F, 'Supplemental Arrows-B'],
  [0x2980, 0x29FF, 'Miscellaneous Mathematical Symbols-B'],
  [0x2A00, 0x2AFF, 'Supplemental Mathematical Operators'],
  [0x2B00, 0x2BFF, 'Miscellaneous Symbols and Arrows'],
  [0x2E80, 0x2EFF, 'CJK Radicals Supplement'],
  [0x2F00, 0x2FDF, 'Kangxi Radicals'],
  [0x2FF0, 0x2FFF, 'Ideographic Description Characters'],
  [0x3000, 0x303F, 'CJK Symbols and Punctuation'],
  [0x3040, 0x309F, 'Hiragana'],
  [0x30A0, 0x30FF, 'Katakana'],
  [0x3100, 0x312F, 'Bopomofo'],
  [0x3130, 0x318F, 'Hangul Compatibility Jamo'],
  [0x3190, 0x319F, 'Kanbun'],
  [0x31A0, 0x31BF, 'Bopomofo Extended'],
  [0x31F0, 0x31FF, 'Katakana Phonetic Extensions'],
  [0x3200, 0x32FF, 'Enclosed CJK Letters and Months'],
  [0x3300, 0x33FF, 'CJK Compatibility'],
  [0x3400, 0x4DBF, 'CJK Unified Ideographs Extension A'],
  [0x4DC0, 0x4DFF, 'Yijing Hexagram Symbols'],
  [0x4E00, 0x9FFF, 'CJK Unified Ideographs'],
  [0xA000, 0xA48F, 'Yi Syllables'],
  [0xA490, 0xA4CF, 'Yi Radicals'],
  [0xAC00, 0xD7AF, 'Hangul Syllables'],
  [0xD800, 0xDB7F, 'High Surrogates'],
  [0xDB80, 0xDBFF, 'High Private Use Surrogates'],
  [0xDC00, 0xDFFF, 'Low Surrogates'],
  [0xE000, 0xF8FF, 'Private Use Area'],
  [0xF900, 0xFAFF, 'CJK Compatibility Ideographs'],
  [0xFB00, 0xFB4F, 'Alphabetic Presentation Forms'],
  [0xFB50, 0xFDFF, 'Arabic Presentation Forms-A'],
  [0xFE00, 0xFE0F, 'Variation Selectors'],
  [0xFE20, 0xFE2F, 'Combining Half Marks'],
  [0xFE30, 0xFE4F, 'CJK Compatibility Forms'],
  [0xFE50, 0xFE6F, 'Small Form Variants'],
  [0xFE70, 0xFEFF, 'Arabic Presentation Forms-B'],
  [0xFF00, 0xFFEF, 'Halfwidth and Fullwidth Forms'],
  [0xFFF0, 0xFFFF, 'Specials'],
  [0x10000, 0x1007F, 'Linear B Syllabary'],
  [0x10080, 0x100FF, 'Linear B Ideograms'],
  [0x10100, 0x1013F, 'Aegean Numbers'],
  [0x10300, 0x1032F, 'Old Italic'],
  [0x10330, 0x1034F, 'Gothic'],
  [0x10380, 0x1039F, 'Ugaritic'],
  [0x10400, 0x1044F, 'Deseret'],
  [0x10450, 0x1047F, 'Shavian'],
  [0x10480, 0x104AF, 'Osmanya'],
  [0x10800, 0x1083F, 'Cypriot Syllabary'],
  [0x1D000, 0x1D0FF, 'Byzantine Musical Symbols'],
  [0x1D100, 0x1D1FF, 'Musical Symbols'],
  [0x1D300, 0x1D35F, 'Tai Xuan Jing Symbols'],
  [0x1D400, 0x1D7FF, 'Mathematical Alphanumeric Symbols'],
  [0x20000, 0x2A6DF, 'CJK Unified Ideographs Extension B'],
  [0x2F800, 0x2FA1F, 'CJK Compatibility Ideographs Supplement'],
  [0xE0000, 0xE007F, 'Tags']
]

function getUnicodeRange (ch) {
  var c = ch.charCodeAt(0)
  for (var i = 0, len = UNICODE_RANGES.length; i < len; i++) {
    var range = UNICODE_RANGES[i]
    if (range[0] <= c && c <= range[1]) {
      return i
    }
  }
  return -1
}

function inUnicodeRanges (unicodeRanges, char) {
  if (!char) {
    return false
  }
  var code = char.charCodeAt(0)
  for (var i = 0, len = unicodeRanges.length; i < len; i++) {
    var range = UNICODE_RANGES[unicodeRanges[i]]
    if (range[0] <= code && code <= range[1]) {
      return true
    }
  }
  return false
}

function tokenize (text) {
  var tokens = []
  if (text.length > 0) {
    var t = ''
    var range = getUnicodeRange(text[0])
    for (var i = 0, len = text.length; i < len; i++) {
      var ch = text[i]
      var r = getUnicodeRange(ch)
      if (range === r) {
        t = t + ch
      } else {
        tokens.push(t)
        t = ch
      }
      range = r
    }
    tokens.push(t)
  }
  return tokens
}

exports.UNICODE_RANGES = UNICODE_RANGES
exports.getUnicodeRange = getUnicodeRange
exports.inUnicodeRanges = inUnicodeRanges
exports.tokenize = tokenize
