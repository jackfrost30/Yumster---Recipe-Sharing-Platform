import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/recipedetail.css';
import { ACCESS_TOKEN } from '../../constants';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipeDetail();
    fetchComments();
    fetchCurrentUser();
  }, [id]);

  const fetchRecipeDetail = async () => {
    try {
      const response = await api.get(`/api/recipes/${id}/`);
      setRecipe(response.data);
      checkFavorite();
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  // const fetchComments = async () => {
  //   try {
  //     const response = await api.get(`/api/comments/?recipe=${id}`);
  //     setComments(response.data);
  //   } catch (error) {
  //     console.error('Error fetching comments:', error);
  //   }
  // };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/comments/?recipe=${id}`);
      const commentsData = response.data;
      // Fetch usernames for each comment
      const updatedComments = await Promise.all(
        commentsData.map(async (comment) => {
          const userResponse = await api.get(`/api/users/${comment.user}/`);
          const username = userResponse.data.username;
          return { ...comment, username };
        })
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

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

  const checkFavorite = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get(`/api/favorites/check/?recipe=${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsFavorite(response.data.is_favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const userId = currentUser.id;
      if (isFavorite) {
        await api.delete(`/api/favorites/delete/?recipe=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        await api.post(
          `/api/favorites/`,
          { recipe: id, user: userId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const currentUserData = await fetchCurrentUser();
      const userId = currentUserData.id;
      await api.post(
        '/api/comments/',
        {
          recipe: id,
          text: newComment,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEditRecipe = async () => {
    try {
      const response = await api.get(`/api/recipes/${id}/`);
      const recipeData = response.data;
      navigate(`/recipes/edit/${id}/`, { state: { recipeData } });
    } catch (error) {
      console.error('Error fetching recipe details for editing:', error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      await api.delete(`/api/recipes/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      <div className='recipe-detail-container'>
        <div className='recipe-detail'>
          <button className='back-button' onClick={handleBack}>
            Back
          </button>
          <div className='recipe-content'>
            <div className='recipe-image'>
              <img src={recipe.image} alt={recipe.title} />
            </div>
            <div className='recipe-info'>
              <h1>{recipe.title}</h1>
              <p className='description'>{recipe.description}</p>
              <p>
                <strong>Posted by:</strong> {recipe.username}
              </p>
              <p>
                <strong>Ingredients:</strong>
              </p>
              <ul>
                {recipe.ingredients
                  .split('\r')
                  .filter((ingredient) => ingredient)
                  .map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
              </ul>
              <p>
                <strong>Instructions:</strong>
              </p>
              <ol>
                {recipe.instructions
                  .split('\r')
                  .filter((instruction) => instruction)
                  .map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
              </ol>
              <p>
                <strong>Created at:</strong>{' '}
                {new Date(recipe.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated at:</strong>{' '}
                {new Date(recipe.updated_at).toLocaleString()}
              </p>
              <div
                className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
                onClick={toggleFavorite}
              ></div>
              {currentUser && currentUser.id == recipe.user && (
                <div>
                  <button className='edit-button' onClick={handleEditRecipe}>
                    Edit
                  </button>
                  <button
                    className='delete-button'
                    onClick={handleDeleteRecipe}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='comments-section'>
            <h2>Comments</h2>
            <form onSubmit={handlePostComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Add a comment...'
                required
              ></textarea>
              <button type='submit'>Post Comment</button>
            </form>
            <div className='comments-list'>
              {comments
                .filter((comment) => comment.recipe === parseInt(id))
                .map((comment) => (
                  <div key={comment.id} className='comment'>
                    <p>
                      <strong> {comment.username}: </strong>
                      {comment.text}
                    </p>
                    <p className='comment-timestamp'>
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
