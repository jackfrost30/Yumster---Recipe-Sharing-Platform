# Generated by Django 5.0.6 on 2024-07-09 01:02

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("recipes", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="recipe",
            old_name="desciption",
            new_name="description",
        ),
    ]
