from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from analysis.models import CustomUser

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = CustomUser
        fields = ('username', 'email', 'total_income', 'group', 'group_leader')

class CustomUserChangeForm(UserChangeForm):

    class Meta(UserChangeForm):
        model = CustomUser
        fields = ('username', 'email', 'total_income', 'group', 'group_leader')