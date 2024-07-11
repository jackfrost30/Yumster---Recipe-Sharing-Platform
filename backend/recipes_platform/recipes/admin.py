from django.contrib import admin
from .models import  Recipe, Favorite, Comment

# admin.site.register(User)
admin.site.register(Recipe)
# admin.site.register(Category)
admin.site.register(Favorite)
admin.site.register(Comment)
# admin.site.register(Rating)