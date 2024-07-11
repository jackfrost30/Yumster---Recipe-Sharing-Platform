import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/favorite.css';
import { ACCESS_TOKEN } from '../../constants';

const FavoriteList = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  // const [pageInfo, setPageInfo] = useState({
  //   count: favoriteRecipes.length,
  //   next: null,
  //   previous: null,
  // });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchFavoriteRecipes();
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

  const fetchFavoriteRecipes = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get('/api/favorites/user_favorites/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const baseURL = import.meta.env.VITE_API_URL;
      const processedRecipes = response.data.map((recipe) => ({
        ...recipe,
        image: `${baseURL}${recipe.image}`,
      }));

      setFavoriteRecipes(processedRecipes);
      // setPageInfo(response.data);
    } catch (error) {
      console.error('Error fetching user favorite recipes:', error);
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
      setFavoriteRecipes(response.data.results);
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
      const response = await api.get('/api/favorites/user_favorites/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page,
          page_size: 8,
        },
      });

      const baseURL = import.meta.env.VITE_API_URL;
      const processedRecipes = response.data.map((recipe) => ({
        ...recipe,
        image: `${baseURL}${recipe.image}`,
      }));

      setFavoriteRecipes(processedRecipes);
      setPageInfo({
        count: processedRecipes.length,
        next: null,
        previous: null,
      });
    } catch (error) {
      console.error('Error fetching recipes for page:', error);
    }
  };

  // const total_pages = Math.ceil(pageInfo.count / 8);

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
        {favoriteRecipes.length === 0 && (
          <div className='no-recipes'>
            <h2>You haven't favorited any recipes yet!</h2>
            <Link to='/recipes' className='post-recipe-button'>
              Explore Recipes
            </Link>
          </div>
        )}
        {favoriteRecipes.map((favorite) => (
          <div key={favorite.id} className='recipe-card'>
            <Link to={`/recipes/${favorite.id}`} className='recipe-link'>
              <div className='recipe-image'>
                <img src={favorite.image} alt={favorite.title} />
              </div>
              <div className='recipe-details'>
                <h2>{favorite.title}</h2>
                <p>{favorite.description}</p>
              </div>
            </Link>
          </div>
        ))}

        {/* {total_pages > 1 && (
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
        )} */}
      </div>
    </div>
  );
};

export default FavoriteList;
