import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/profile.css';
import { ACCESS_TOKEN } from '../../constants';

const Profile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchUserRecipes();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get('/api/current_user/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get('/api/recipes/my-recipes/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecipes(response.data.results);
      setPageInfo(response.data);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/api/recipes/?search=${searchTerm}`);
      setRecipes(response.data.results);
      setPageInfo(response.data);
    } catch (error) {
      console.error('Error fetching recipes based on search term:', error);
    }
  };

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = async (page) => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const url = searchTerm
        ? `/api/recipes/my-recipes/?search=${searchTerm}&page=${page}`
        : `/api/recipes/my-recipes/?page=${page}`;
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecipes(response.data.results);
      setPageInfo(response.data);
    } catch (error) {
      console.error('Error fetching recipes for page:', error);
    }
  };

  const total_pages = Math.ceil(pageInfo.count / 8);

  return (
    <div className='profile-container'>
      <div className='navbar'>
        <div className='menu-toggle' onClick={() => setShowMenu(!showMenu)}>
          <div className='hamburger'></div>
          <div className='hamburger'></div>
          <div className='hamburger'></div>
        </div>
        {showMenu && (
          <div className='menu'>
            <Link
              to='/recipes'
              className='nav-item'
              onClick={() => setShowMenu(false)}
            >
              FYP
            </Link>
            <Link
              to='/recipes/create'
              className='nav-item'
              onClick={() => setShowMenu(false)}
            >
              Post Recipe
            </Link>
            <Link
              to='/profile'
              className='nav-item'
              onClick={() => setShowMenu(false)}
            >
              Your Recipes
            </Link>
            <Link
              to='/favorites'
              className='nav-item'
              onClick={() => setShowMenu(false)}
            >
              Favorites
            </Link>
            <button className='nav-item' onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
      {/* Search bar outside of navbar */}
      <div className='search-bar'>
        <input
          type='text'
          className='search-input'
          placeholder='Search recipes...'
          value={searchTerm}
          onChange={handleChangeSearch}
        />
        <button className='search-button' onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className='content'>
        {recipes.length === 0 && (
          <div className='no-recipes'>
            <h2>You don't have any recipes yet!</h2>
            <Link to='/recipes/create' className='post-recipe-button'>
              Post a Recipe Now
            </Link>
          </div>
        )}
        {recipes.map((recipe) => (
          <div key={recipe.id} className='recipe-card'>
            <Link to={`/recipes/${recipe.id}`} className='recipe-link'>
              <div className='recipe-image'>
                <img src={recipe.image} alt={recipe.title} />
              </div>
              <div className='recipe-details'>
                <h2>{recipe.title}</h2>
                <p>{recipe.description}</p>
              </div>
            </Link>
          </div>
        ))}
        {total_pages > 1 && (
          <div className='pagination'>
            {Array.from({ length: total_pages }).map((_, index) => (
              <button
                key={index}
                className='pagination-button'
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
