import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AuthUser from './pages/auth/AuthUser'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={<AuthUser/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
