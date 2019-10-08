from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Sum
from datetime import datetime
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Sum


class Group(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    def get_total_income(self):
        all_users_income = CustomUser.objects.filter(group=self).aggregate(Sum('income'))
        return all_users_income

    def liability_spend(self, month):
        all_users = CustomUser.objects.filter(group = self)
        all_users = list(all_users)
        all_liabilities = Liability.objects.filter(user__in = all_users)
        liability_list = list(set([i.name for i in all_liabilities]))

        expenditure_dict = {}
        for user in all_users:
            all_expenditure = Expenditure.objects.filter(user = user, date__month = month)
            for val in all_expenditure:
                if val.spent_on.name not in expenditure_dict:
                    expenditure_dict[val.spent_on.id] = {"amount":val.amount, "liability":val.spent_on.name}
                else:
                    expenditure_dict[val.spent_on.id] += {"amount":val.amount, "liability":val.spent_on.name}
        for i in liability_list:
            if i not in expenditure_dict:
                expenditure_dict[i] = 0
        return expenditure_dict

    def get_liability_percentage(self):
        all_users = Users.objects.filter(group = self)
        liability_percentage = {}
        total_expenditure = 0
        for user in all_users:
            all_expenditure = Expenditure.objects.filter(user = user)
            for val in all_expenditure:
                if val.spent_on.name not in liability_percentage:
                    liability_list[val.spent_on.name] = val.amount
                else:
                    liability_list[val.spent_on.name] += val.amount
                total_expenditure += val.amount
        liability_percentage_dict = dict(map(lambda x: (x[0], x[1]/(total_expenditure)*100), liability_percentage.items() ))
        return liability_list


    def get_last_five_month_spend(self):
        current_month = datetime.now().month
        last_five_month_list = []
        for i in range(5):
            last_five_month_list.append(self.liability_spend(self, current_month))
            current_month -= 1
            if(current_month == 0):
                current_month = 12
        return last_five_month_list


class CustomUser(AbstractUser):
    total_income = models.IntegerField(default = 0)
    group = models.ForeignKey(Group, null = True, on_delete = models.SET_NULL)
    group_leader = models.BooleanField(default = False)

    # def get_spendable_amount(Self, current_month):
    #     income_this_month = Income.objects.filter(uaer = self, date__month = current_month).aggregate(Sum("amount"))
    #     if(current_month == 0):
    #         last_month = 11
    #     else:
    #         last_month = current_month - 1
    #     total_expenditure_last_month = Expenditure.objects.filter(user = self, date__month = last_month).aggregate(Sum("amount"))


    def get_expenditure_dict(self, current_month):
        # import pdb; pdb.set_trace()
        # current_month = datetime.now().month
        if(self.group):
            all_users = CustomUser.objects.filter(group = self.group)
            all_users = list(all_users)
            all_liabilities = Liability.objects.filter(user__in = all_users)
            liability_list = list(all_liabilities)
        else:
            liability_list = Liability.objects.filter(user = self)
            liability_list = list(liability_list)

        all_expenditure = Expenditure.objects.filter(user = self, date__month = current_month)
        expenditure_dict = {}
        for val in all_expenditure:
            if val.spent_on.name not in expenditure_dict:
                expenditure_dict[val.spent_on.id] = {"amount":val.amount, "liability":val.spent_on.name}
            else:
                expenditure_dict[val.spent_on.id] += {"amount":val.amount, "liability":val.spent_on.name}

        for val in liability_list:
            if val.id not in expenditure_dict:
                expenditure_dict[val.id] = {"amount":0, "liability":val.name}
        return expenditure_dict

    def get_last_five_month_spend(self):
        current_month = datetime.now().month
        last_five_month_list = []
        for i in range(5):
            last_five_month_list.append(self.get_expenditure_dict((current_month-i)))
        return last_five_month_list

    def get_income_dict(self, current_month):
        all_income = Income.objects.filter(user = self, date__month = current_month)
        income_dict = {}
        temp = 0
        for val in all_income:
            temp += val.amount
        return temp


    def get_last_five_month_income(self):
        current_month = datetime.now().month
        last_five_month_list = []
        for i in range(5):
            last_five_month_list.append(self.get_income_dict((current_month-i)))
        return last_five_month_list


    def __str__(self):
        return self.username

class UserGoal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, on_delete = models.SET)
    liability = models.ForeignKey("Liability", null = True, on_delete = models.SET)
    percentage = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])

class UserSavingsGoal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, on_delete = models.CASCADE)
    percentage = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    date = models.DateField(null = True)


class GroupGoal(models.Model):
    group = models.ForeignKey(Group, null = True, on_delete = models.SET)
    liability = models.ForeignKey("Liability", null = True, on_delete = models.SET)
    percentage = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])


class Liability(models.Model):
    name = models.CharField(max_length = 50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, on_delete = models.SET)
    # group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True)
    # total_amount = models.FloatField(default = False)
    # perentage = models.IntegerField(default = 0)


    def __str__(self):
        return self.name


class Expenditure(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, on_delete = models.SET)
    amount = models.IntegerField(null = False, default = 0)
    spent_on = models.ForeignKey("Liability", null = True, on_delete = models.SET)
    date = models.DateField(null = True)

    def __str__(self):
        return (self.spent_on.name + "_" + self.user.username)


class Income(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null = True, on_delete = models.SET)
    amount = models.IntegerField(validators = [MinValueValidator(0)], null = False, default = 0)
    source = models.CharField(max_length = 50)
    date = models.DateField(null = True)

    def __str__(self):
        return (self.source.name + "_" + self.user.username)