import { notifications } from './notifications';
class SearchEngine {
  search(query, data) {
    if (!query || !query.trim()) return { results: [], count: 0 };
    query = query.toLowerCase().trim();
    const results = [];
    const queryWords = query.split(' ');
    const searchInObject = (obj, path = '') => {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => searchInObject(item, path + '[' + index + ']'));
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            const newPath = path ? path + '.' + key : key;
            if (typeof value === 'object' && value !== null) {
              searchInObject(value, newPath);
            } else if (value && value !== '') {
              const strValue = String(value).toLowerCase();
              if (queryWords.every(word => strValue.includes(word))) {
                results.push({ path: newPath, value: value });
              }
            }
          });
        }
      }
    };
    searchInObject(data);
    notifications.searchDone(results.length);
    return { results, count: results.length };
  }
}
export const searchEngine = new SearchEngine();
export const SearchBox = () => null;
