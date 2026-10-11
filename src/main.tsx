import { createRoot } from 'react-dom/client'
import '@fontsource/amiri/arabic-400.css'; import '@fontsource/amiri/arabic-700.css'; import '@fontsource/amiri/latin-400.css'
import '@fontsource/noto-naskh-arabic/arabic-400.css'; import '@fontsource/noto-naskh-arabic/arabic-700.css'
import '@fontsource/plus-jakarta-sans/latin-400.css'; import '@fontsource/plus-jakarta-sans/latin-600.css'
import '@fontsource/source-serif-4/latin-400.css'; import '@fontsource/source-serif-4/latin-600.css'
import './index.css'
import App from './App'
createRoot(document.getElementById('root')!).render(<App />)
