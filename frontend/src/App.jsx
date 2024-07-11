import react from 'react';
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
// import AdminDashboard from './components/Admin/AdminDashboard';
import Profile from './components/Auth/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
// import CategoryList from './components/Categories/CategoryList';
import CommentForm from './components/Comments/CommentForm';
import CommentList from './components/Comments/CommentList';
import FavoriteList from './components/Favorites/FavoriteList';
// import Ratings from './components/Ratings/Ratings';
import RecipeDetail from './components/Recipes/RecipeDetail';
import RecipeForm from './components/Recipes/RecipeForm';
import RecipeList from './components/Recipes/RecipeList';

function Logout() {
  localStorage.clear();
  return <Navigate to='/login' />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterAndLogout />} />
        <Route path='/logout' element={<Logout />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/recipes'
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/recipes/create'
          element={
            <ProtectedRoute>
              <RecipeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='/recipes/edit/:id'
          element={
            <ProtectedRoute>
              <RecipeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='/recipes/:id'
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path='/categories'
          element={
            <ProtectedRoute>
              <CategoryList />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path='/favorites'
          element={
            <ProtectedRoute>
              <FavoriteList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/comments'
          element={
            <ProtectedRoute>
              <CommentList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/comments/create'
          element={
            <ProtectedRoute>
              <CommentForm />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path='/ratings'
          element={
            <ProtectedRoute>
              <Ratings />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path='/admin'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
