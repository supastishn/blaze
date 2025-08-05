import { useState } from 'react'
import { compile } from '../../../src/compiler'
import './App.css'

const initialCode = `
function factorial(n) {
  if (n == 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

print(factorial(5));
`.trim();

function App() {
  const [tsCode, setTsCode] = useState(initialCode);
  const [cppCode, setCppCode] = useState('');

  const handleCompile = () => {
    const result = compile(tsCode);
    setCppCode(result);
  };

  return (
    <>
      <h1>ts2cpp</h1>
      <div className="container">
        <div className="editor">
          <h2>TypeScript Input</h2>
          <textarea
            value={tsCode}
            onChange={(e) => setTsCode(e.target.value)}
            spellCheck="false"
          />
        </div>
        <div className="output">
          <h2>C++ Output</h2>
          <pre><code>{cppCode}</code></pre>
        </div>
      </div>
      <button onClick={handleCompile}>Compile</button>
    </>
  )
}

export default App
