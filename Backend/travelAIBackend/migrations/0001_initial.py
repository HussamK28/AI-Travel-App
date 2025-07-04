# Generated by Django 5.0.3 on 2025-04-24 09:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(default='John', max_length=200)),
                ('surname', models.CharField(default='Doe', max_length=200)),
                ('email', models.CharField(default='JohnDoe123@gmail.com', max_length=200)),
                ('password', models.CharField(default='Calculator123!', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='hotels',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='The Museum', max_length=200)),
                ('roomDescription', models.CharField(default='A hotel', max_length=500)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('checkInDate', models.DateField(default='2025-01-01')),
                ('checkOutDate', models.DateField(default='2025-01-01')),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='travelAIBackend.users')),
            ],
        ),
        migrations.CreateModel(
            name='flights',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('airline', models.CharField(default='BA', max_length=200)),
                ('flightNum', models.IntegerField(default=123)),
                ('departureAirport', models.CharField(default='LHR', max_length=200)),
                ('departureDate', models.DateField(default='2025-01-01')),
                ('departureTime', models.TimeField(default='09:00')),
                ('arrivalAirport', models.CharField(default='LHR', max_length=200)),
                ('arrivalTime', models.TimeField(default='09:00')),
                ('duration', models.CharField(default='6H30M', max_length=200)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='travelAIBackend.users')),
            ],
        ),
        migrations.CreateModel(
            name='attractions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='The Museum', max_length=200)),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='travelAIBackend.users')),
            ],
        ),
    ]
