
declare module '@mui/material/styles' {
  interface PaletteOptions {
    table?: Partial<TypeTable>;
  }
}
declare module '@mui/material/styles' {
  interface TypeTable {
    head: {
      background: string;
    };
    cell: {
      border: string;
    };
  }
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}
