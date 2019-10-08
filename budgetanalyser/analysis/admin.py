from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from analysis.api.forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Group, Expenditure, Liability, Income

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['username', 'email', 'income', 'group', 'group_leader']

admin.site.register(CustomUser)
admin.site.register(Group)
admin.site.register(Expenditure)
admin.site.register(Liability)
admin.site.register(Income)

