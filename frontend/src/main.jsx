// // import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//     <App />
//   /* </StrictMode>, */
// )


import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './routes/Router.jsx'
// import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <App />
    </main> */}

      <Router />

  </React.StrictMode>
)
