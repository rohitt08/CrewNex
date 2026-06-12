import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

const Layout = ({children}) => {
  const location = useLocation();
  const hideFooter = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer/>}
    </div>
  )
}

export default Layout
