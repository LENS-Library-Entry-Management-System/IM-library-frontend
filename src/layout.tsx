import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      {/* shared layout: header, nav, etc. */}
      <Outlet />
    </div>
  )
}

export default Layout
