import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../api';
import '../../styles/recipeform.css';
import { ACCESS_TOKEN } from '../../constants';

const RecipeForm = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { recipeData } = location.state || {};

  useEffect(() => {
    fetchCurrentUser();
    if (recipeData) {
      setTitle(recipeData.title || '');
      setDescription(recipeData.description || '');
      setIngredients(recipeData.ingredients || '');
      setInstructions(recipeData.instructions || '');
      if (recipeData.image) {
        const urlParts = recipeData.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        setImage(filename);
      }
    }
  }, [recipeData]);

  const fetchCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get('/api/current_user/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    if (image) {
      formData.append('image', image);
    }
    const currentUserData = await fetchCurrentUser();
    const userId = currentUserData.id;

    formData.append('user', userId);

    try {
      if (recipeData) {
        await api.put(`/api/recipes/${recipeData.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/api/recipes/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/recipes');
    } catch (error) {
      console.error('Error creating/updating recipe:', error);
    }
  };

  // Function to format text into bullet points or list items
  const formatTextToList = (text) => {
    return text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line, index) => <li key={index}>{line}</li>);
  };

  return (
    <div>
      <div className='navbar'>
        <button className='back-button' onClick={() => navigate(-1)}>
          Back
        </button>
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
            <button
              className='nav-item'
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className='recipe-form-container'>
        <form className='recipe-form' onSubmit={handleSubmit}>
          <h2>{recipeData ? 'Edit Recipe' : 'Post a Recipe'}</h2>
          <div className='form-group'>
            <label htmlFor='title'>Recipe Title</label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='ingredients'>
              Ingredients (list each ingredient on a new line)
            </label>
            <textarea
              id='ingredients'
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
            <ul className='formatted-list'>{formatTextToList(ingredients)}</ul>
          </div>
          <div className='form-group'>
            <label htmlFor='instructions'>
              Instructions (list each instruction on a new line)
            </label>
            <textarea
              id='instructions'
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
            <ol className='formatted-list'>{formatTextToList(instructions)}</ol>
          </div>
          <div className='form-group'>
            <label htmlFor='image'>Image</label>
            <input
              type='file'
              id='image'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button type='submit' className='submit-button'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
