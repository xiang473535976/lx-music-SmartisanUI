import { PINYIN_END_CODE, PINYIN_START_CODE, pinyinInitials } from './pinyinInitials'

const isAsciiLetter = /^[a-zA-Z]$/
const isDigit = /^[0-9]$/

/**
 * 取字符串首个有效字符的拼音首字母，无法识别时返回 '#'
 * （前导的空格、标点等会被跳过，例如「(周杰伦)」→ 'Z'）
 */
export const getPinyinInitial = (text: string): string => {
  for (const ch of text.trim()) {
    const code = ch.codePointAt(0)!
    if (code >= PINYIN_START_CODE && code <= PINYIN_END_CODE) {
      const letter = pinyinInitials.charAt(code - PINYIN_START_CODE)
      return letter == '#' ? '#' : letter
    }
    if (isAsciiLetter.test(ch)) return ch.toUpperCase()
    if (isDigit.test(ch)) return '#'
    // 其它符号跳过，继续看下一个字符
  }
  return '#'
}

const collator = (() => {
  try {
    return new Intl.Collator('zh-Hans-CN', { sensitivity: 'base' })
  } catch (err) {
    return null
  }
})()

/**
 * 按拼音排序（先用首字母分桶，再交给 ICU 的拼音排序器比较）
 */
export const compareByPinyin = (a: string, b: string): number => {
  const ra = getPinyinInitial(a)
  const rb = getPinyinInitial(b)
  if (ra != rb) {
    if (ra == '#') return 1
    if (rb == '#') return -1
    return ra < rb ? -1 : 1
  }
  if (collator) return collator.compare(a, b)
  return a.localeCompare(b)
}
