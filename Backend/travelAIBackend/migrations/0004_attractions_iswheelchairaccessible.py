# Generated by Django 5.0.3 on 2025-05-05 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travelAIBackend', '0003_alter_travelpref_favouriteactivities'),
    ]

    operations = [
        migrations.AddField(
            model_name='attractions',
            name='isWheelchairAccessible',
            field=models.CharField(default='YES', max_length=200),
        ),
    ]
