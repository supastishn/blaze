export type Node = 
  | { type: 'Program'; body: Node[] }
  | { type: 'Identifier'; name: string }
  | { type: 'NumericLiteral'; value: number }
  // ... other AST node types ...
;
