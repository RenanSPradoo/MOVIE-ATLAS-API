import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Loader from './components/Loader';
import { FavoritesProvider } from './context/FavoritesContext';

const Home          = lazy(() => import('./pages/Home'));
const MovieDetail   = lazy(() => import('./pages/MovieDetail'));
const GenrePage     = lazy(() => import('./pages/GenrePage'));
const SearchPage    = lazy(() => import('./pages/SearchPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/movie/:id"  element={<MovieDetail />} />
              <Route path="/genre/:id"  element={<GenrePage />} />
              <Route path="/search"     element={<SearchPage />} />
              <Route path="/favorites"  element={<FavoritesPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
