from django.db import models
from django.contrib.auth.models import User

# class User(AbstractUser):
#     email = models.EmailField(unique=True)

# class Category(models.Model):
#     name = models.CharField(max_length=100)

class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    ingredients = models.TextField()
    instructions = models.TextField()
    # categories = models.ManyToManyField(Category)
    image = models.ImageField(upload_to='recipe_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=150, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.username = self.user.username
        super().save(*args, **kwargs)

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# class Rating(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
#     score = models.IntegerField()
#     created_at = models.DateTimeField(auto_now_add=True)
