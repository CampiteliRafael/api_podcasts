# Query String Utilities Documentation

## Overview
The query string utilities provide methods for parsing and stringifying URL query parameters. These functions handle type conversion, array formatting, and nested object structures while maintaining compatibility with URL encoding standards.

## parseQueryString Function

### Purpose
Converts a URL query string into a structured JavaScript object with proper type handling.

### Parameters
- `query` (string): The query string to parse (without leading '?')

### Return Value
- `Record<string, any>`: Parsed object with converted types

### Features
- Automatically converts number-like strings to numbers
- Handles array parameters using multiple keys or comma-separated values
- Supports nested objects through square bracket notation
- Decodes URL-encoded characters
- **Array Detection**:
  - `?tags=js&tags=ts` → `{ tags: ['js', 'ts'] }`
  - `?colors=red,blue` → `{ colors: ['red', 'blue'] }`

- **Nested Objects**:
  `?filters[type]=podcast&filters[year]=2023` → 
  ```js
  { filters: { type: 'podcast', year: 2023 } }
  ```

### Example Usage
```typescript
// Basic parsing
parseQueryString('name=John&age=25');
// Returns: { name: 'John', age: 25 }

// Array handling
parseQueryString('skills=node&skills=typescript');
// Returns: { skills: ['node', 'typescript'] }

// Complex structure
parseQueryString('filters[type]=audio&filters[duration]=300&page=2');
// Returns: { filters: { type: 'audio', duration: 300 }, page: 2 }
```

## stringifyQuery Function

### Purpose
Converts a JavaScript object into a URL-encoded query string.

### Parameters
- `obj` (object): The object to convert
- `options` (optional):
  - `encode` (boolean): Enable URL encoding (default: true)
  - `arrayFormat` ('repeat' | 'comma'): Array serialization format

### Return Value
- `string`: URL-encoded query string

### Features
- Handles nested objects and arrays
- Supports custom array formatting
- Skips undefined and empty values
- Automatically encodes special characters

### Example Usage
```typescript
// Basic object
stringifyQuery({ page: 2, search: 'podcast' });
// Returns: 'page=2&search=podcast'

// Array formatting
stringifyQuery({ tags: ['js', 'ts'] }, { arrayFormat: 'repeat' });
// Returns: 'tags=js&tags=ts'

stringifyQuery({ tags: ['js', 'ts'] }, { arrayFormat: 'comma' });
// Returns: 'tags=js,ts'

// Nested objects
stringifyQuery({
  filters: {
    type: 'audio',
    duration: { min: 300, max: 600 }
  }
});
// Returns: 'filters[type]=audio&filters[duration][min]=300&filters[duration][max]=600'
```

## Special Cases Handling

### Type Conversion
- **Numbers**: `'25'` → `25`
- **Booleans**: `'true'` → `true`, `'false'` → `false`
- **Null**: `'null'` → `null`

### Edge Cases
- Empty values: `'query='` → `{ query: '' }`
- Malformed pairs: `'key=value=extra'` → `{ key: 'value=extra' }`
- Nested arrays: `'matrix[0][0]=1` → `{ matrix: [[1]] }`

## Encoding/Decoding
- Uses `decodeURIComponent` for parsing
- Uses `encodeURIComponent` for stringification
- Preserves encoded characters: `%20` remains as space

## Best Practices
1. Use array format consistently across the application
2. Validate input before parsing
3. Handle potential prototype pollution in security-sensitive contexts
4. Consider size limits for nested structures