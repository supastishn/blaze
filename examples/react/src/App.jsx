import { useState, useCallback } from 'react'
import { compile } from '../../../src/compiler'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
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

  const onTsChange = useCallback((value) => {
    setTsCode(value);
  }, []);

  return (
    <>
      <h1>ts2cpp</h1>
      <div className="container">
        <div className="editor">
          <h2>TypeScript Input</h2>
          <CodeMirror
            value={tsCode}
            height="600px"
            extensions={[javascript({ typescript: true })]}
            onChange={onTsChange}
            theme={oneDark}
          />
        </div>
        <div className="output">
          <h2>C++ Output</h2>
          <CodeMirror
            value={cppCode}
            height="600px"
            extensions={[cpp()]}
            readOnly={true}
            theme={oneDark}
          />
        </div>
      </div>
      <button onClick={handleCompile}>Compile</button>
    </>
  )
}

export default App
