from django.urls import path, include
from .views import RegisterView, RecipeViewSet, FavoriteViewSet, CommentViewSet, current_user, user_detail
from rest_framework.routers import DefaultRouter



router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
# router.register(r'categories', CategoryViewSet)
router.register(r'favorites', FavoriteViewSet)
router.register(r'comments', CommentViewSet)
# router.register(r'ratings', RatingViewSet)  


urlpatterns = [
    path('', include(router.urls)),
    path('current_user/', current_user, name='current_user'),
    path('users/<int:pk>/', user_detail, name='user-detail'),
]

# urlpatterns += router.urls
