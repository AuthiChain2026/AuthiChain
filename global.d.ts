// Minimal JSX ambient declarations so TypeScript recognises the `key` prop on
// all JSX elements without requiring @types/react to be installed.
// When @types/react is present these declarations are superseded by the full
// React JSX namespace.
declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number | null
  }
}
