/* tslint:disable */
/* eslint-disable */
/**
 * 格式化数字
 * 
 * # 参数
 * * `num` - 需要格式化的数字
 * 
 * # 返回值
 * * 格式化后的字符串
 *   - 大于等于10000时，以"W"为单位，保留一位小数
 *   - 大于等于1000时，以"K"为单位，保留一位小数
 *   - 小于1000时，直接返回数字字符串
 */
export function format_number(num: number): string;
/**
 * 获取文章摘要
 * 
 * # 参数
 * * `content` - 文章内容（Markdown格式）
 * 
 * # 返回值
 * * 处理后的摘要字符串
 *   - 移除所有Markdown标记
 *   - 将换行符替换为空格
 *   - 如果字符数超过180，截取前180个字符并添加省略号
 *   - 如果字符数不超过180，返回完整文本
 */
export function get_article_summary(content: string): string;
/**
 * 统计文章字数
 * 
 * # 参数
 * * `markdown` - Markdown格式的文章内容
 * 
 * # 返回值
 * * 包含以下统计信息的JsValue对象:
 *   - characters: 字符数（不含空格和换行）
 *   - words: 中文字数和英文单词数之和
 *   - paragraphs: 段落数
 */
export function word_count(markdown: string): any;
/**
 * 获取年份
 * 
 * # 参数
 * * `since` - 开始日期字符串（格式：YYYY-MM-DD）
 * 
 * # 返回值
 * * 年份字符串
 *   - 如果开始日期与当前日期不同，返回开始年份到当前年份的范围字符串（格式：YYYY - YYYY）
 *   - 如果开始日期与当前日期相同，返回当前年份字符串（格式：YYYY）
 */
export function get_year(since: string): string;
