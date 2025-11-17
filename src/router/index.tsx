import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../layout'
import App from '../App'
import Records from '../pages/records'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="records" element={<Records />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
