# Generated by Django 2.2.4 on 2019-09-30 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='spent_on',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET, to='analysis.Liability'),
        ),
    ]