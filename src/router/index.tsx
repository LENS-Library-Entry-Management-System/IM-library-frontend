import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../layout'
import App from '../App'
import Records from '../pages/records'
import SignUp from '@/pages/signUp'
import EditInfo from '@/pages/editInfo'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="records" element={<Records />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="edit-info" element={<EditInfo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
