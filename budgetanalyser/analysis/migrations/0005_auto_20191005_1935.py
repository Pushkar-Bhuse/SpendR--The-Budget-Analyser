# Generated by Django 2.2.4 on 2019-10-05 14:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0004_auto_20191003_2051'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='date',
            field=models.DateField(null=True),
        ),
    ]
