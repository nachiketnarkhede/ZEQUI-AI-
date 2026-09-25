import DOMPurify from 'dompurify';

export const cleanText = (raw: string): string => {
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'] });
};