import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { FindDoctorPage } from './pages/FindDoctorPage'
import { LoginPage } from './pages/LoginPage'
import { SearchResultsPage } from './pages/SearchResultsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchResultsPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/find-doctor" element={<FindDoctorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
