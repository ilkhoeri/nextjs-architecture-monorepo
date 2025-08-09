import { TextTransform, type FormatTransform } from '@repo/utils';

export function getNameToc(title: string, format: FormatTransform = 'capitalize') {
  const numberRgx = /^(\d+\.)\s*(.+)/;
  const cleanTitle = title?.replace(':', '').replace('?', '').trim();

  // untuk format [0.0.0] - YYYY-MM-DD
  const versionMatch = title?.match(/^\[(\d+\.\d+\.\d+)\]\s*-\s*\d{4}-\d{2}-\d{2}$/);
  if (versionMatch) return `v${versionMatch[1]}`; // ubah menjadi v0.0.0

  if (numberRgx.test(cleanTitle)) return cleanTitle;

  const emojiRgx = /[\p{Emoji}\u200B-\u200D\uFE0F]\s/gu;
  if (emojiRgx.test(cleanTitle)) return cleanTitle.replace(emojiRgx, '');

  return TextTransform.text(cleanTitle, format);
}
