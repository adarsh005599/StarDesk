import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Writeartical from './pages/Writeartical.jsx'
import BlogTitles from './pages/BlogTitles.jsx'
import RemoveBag from './pages/RemoveBag.jsx'
import Removeobj from './pages/Removeobj.jsx'
import GenreateImages from './pages/GenreateImages.jsx'
import Community from './pages/community.jsx'
import Reviewresume from './pages/Reviewresume.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const location = useLocation()

  return (
    <div>
      <Toaster />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="write-artical" element={<Writeartical />} />
            <Route path="blog-titles" element={<BlogTitles />} />
            <Route path="remove-bag" element={<RemoveBag />} />
            <Route path="remove-obj" element={<Removeobj />} />
            <Route path="genreat-image" element={<GenreateImages />} />
            <Route path="review-resume" element={<Reviewresume />} />
            <Route path="cummunity" element={<Community />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
