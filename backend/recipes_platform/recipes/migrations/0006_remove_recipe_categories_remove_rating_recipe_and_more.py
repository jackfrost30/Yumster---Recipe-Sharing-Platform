# Generated by Django 5.0.6 on 2024-07-10 21:09

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("recipes", "0005_recipe_categories"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="recipe",
            name="categories",
        ),
        migrations.RemoveField(
            model_name="rating",
            name="recipe",
        ),
        migrations.RemoveField(
            model_name="rating",
            name="user",
        ),
        migrations.DeleteModel(
            name="Category",
        ),
        migrations.DeleteModel(
            name="Rating",
        ),
    ]
