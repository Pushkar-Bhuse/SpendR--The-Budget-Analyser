# Generated by Django 2.2.4 on 2019-10-03 15:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0003_auto_20191003_0204'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='group',
        ),
        migrations.AddField(
            model_name='customuser',
            name='group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='analysis.Group'),
        ),
    ]
