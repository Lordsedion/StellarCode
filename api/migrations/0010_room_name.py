# Generated by Django 5.0.6 on 2024-07-08 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='name',
            field=models.CharField(default='Hello', max_length=150),
            preserve_default=False,
        ),
    ]