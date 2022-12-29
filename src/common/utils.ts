export const convertToSlug = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const OrderTrackerId = () => {
  return 'ORDxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const capitalizeWord = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};

export const toTitleCase = (str): string => {
  return str
    .split(' ')
    .map((word) => capitalizeWord(word))
    .join(' ');
};

export function paginate(array, pageLimit, pageNumber) {
  return array.slice(pageLimit * (pageNumber - 1), pageLimit * pageNumber);
}
