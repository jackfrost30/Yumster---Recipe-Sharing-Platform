from django.shortcuts import render
from rest_framework import generics, permissions, viewsets, filters, status
from .models import Recipe, Favorite, Comment
from .serializers import UserSerializer, RecipeSerializer, FavoriteSerializer, CommentSerializer
from django.contrib.auth.models import User
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.http import JsonResponse


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"})

# @api_view(['GET'])
# @permission_classes([permissions.IsAuthenticated])
# def check_favorite(request):
#     recipe_id = request.GET.get('recipe')
#     user_id = request.user.id

#     try:
#         favorite = Favorite.objects.get(recipe=recipe_id, user=user_id)
#         serializer = FavoriteSerializer(favorite)
#         return Response({'is_favorite': True, 'favorite_data': serializer.data}, status=status.HTTP_200_OK)
#     except Favorite.DoesNotExist:
#         return Response({'is_favorite': False}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class CustomPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecipeSerializer
    pagination_class = CustomPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'ingredients']
    ordering_fields = ['created_at', 'updated_at']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-recipes')
    def my_recipes(self, request):
        user = request.user
        recipes = Recipe.objects.filter(user=user)
        page = self.paginate_queryset(recipes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recipes, many=True)
        return Response(serializer.data)
    
# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = CategorySerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FavoriteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # def get_queryset(self):
    #     user_id = self.request.user.id
    #     return Favorite.objects.filter(user=user_id)

    @action(detail=False, methods=['get'], url_path='check')
    def check_favorite(self, request):
        recipe_id = request.query_params.get('recipe')
        user_id = request.user.id
        
        try:
            favorite = Favorite.objects.get(recipe=recipe_id, user=user_id)
            serializer = self.get_serializer(favorite)
            return Response({'is_favorite': True, 'favorite_data': serializer.data}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({'is_favorite': False}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    # Custom action to delete a favorite by recipe and user
    @action(detail=False, methods=['delete'], url_path='delete')
    def delete_favorite(self, request):
        try:
            recipe_id = request.query_params.get('recipe')
            user_id = request.user.id
            favorite = Favorite.objects.get(recipe=recipe_id, user=user_id)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='user_favorites')
    def user_favorites(self, request):
        user_id = request.user.id
        favorites = Favorite.objects.filter(user=user_id)

        # Collect all recipe IDs from favorites
        recipe_ids = [favorite.recipe.id for favorite in favorites]

        # Fetch all recipes with the collected IDs
        recipes = Recipe.objects.filter(id__in=recipe_ids)

        serialized_recipes = RecipeSerializer(recipes, many=True).data

        return Response(serialized_recipes, status=status.HTTP_200_OK)
    


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        print(f"Authenticated user: {self.request.user}")
        serializer.save(user=self.request.user)

# class RatingViewSet(viewsets.ModelViewSet):
#     queryset = Rating.objects.all()
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = RatingSerializer

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
