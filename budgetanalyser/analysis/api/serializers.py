from django.contrib.auth import get_user_model
from rest_framework import serializers
from analysis.models import CustomUser, Liability, Group, Income

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only = True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'total_income', 'group', 'group_leader']


class LiabilitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    class Meta:
        model = Liability
        fields = ['id', 'name', 'user']

class IncomeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    class Meta:
        model = Income
        fields = ['id', 'amount', 'user', 'date', 'source']