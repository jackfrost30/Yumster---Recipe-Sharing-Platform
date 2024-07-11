import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/recipelist.css';

const RecipeList = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const response = await api.get('/api/recipes/');
      console.log('Response data: ', response.data);
      setRecipes(response.data.results);
      setPageInfo(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
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
      console.log('Page:', page);
      const url = searchTerm
        ? `/api/recipes/?search=${searchTerm}&page=${page}`
        : `/api/recipes/?page=${page}`;
      const response = await api.get(url);
      console.log('response:ss', response);
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

export default RecipeList;
