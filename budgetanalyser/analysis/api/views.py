from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm
from analysis.models import Group, CustomUser, Liability, Expenditure, Income, UserGoal, GroupGoal, UserSavingsGoal
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
from django.http import JsonResponse
import json
from .serializers import UserSerializer, GroupSerializer, LiabilitySerializer, IncomeSerializer
from django.db.models import Sum
from rest_framework import permissions

# class SignUpView(CreateView):
#     form_class = CustomUserCreationForm
#     success_url = reverse_lazy('login')
#     template_name = 'web-analytics-overview.html'

# class DisplayView(View):
#     def get(self,request,*args,**kwargs):
#         temp = {}
#         for key,value in request:
#             temp
#         return render(request,"display.html",{"request":request})

class UserProfile(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user

        return Response({"user":UserSerializer(user).data})


class GetDashboardData(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        if(user.group):
            group = user.group
            group_leader = user.group_leader
        else:
            group = False
            group_leader = False


        Last_Five_Months_Liability_Spend_User = user.get_last_five_month_spend()
        Liability_map = {}
        for key,value in Last_Five_Months_Liability_Spend_User[0].items():
            Liability_map[key] = value['liability']



        Expenditure_User = []
        for i in Last_Five_Months_Liability_Spend_User:
            temp = 0
            for key, value in i.items():
                temp = temp + value['amount']
            Expenditure_User.append(temp)

        # import pdb; pdb.set_trace()

        # Expenditure_User = [sum(list(i.values())[0]) for i in Last_Five_Months_Liability_Spend_User]
        Income_User = []
        Income_User = user.get_last_five_month_income()
        # for i in Income_Dict:
        #     temp = 0
        #     for key, value in i.items():
        #         temp = temp + value['amount']
        #     Income_User.append(temp)


        Bar_Chart_Data_User = {}
        for i in Last_Five_Months_Liability_Spend_User:
            for key,value in i.items():
                if key in Bar_Chart_Data_User:
                    Bar_Chart_Data_User[key].append(value)
                else:
                    Bar_Chart_Data_User[key] = [value]

        Distribution_of_Liabilities_User = user.get_expenditure_dict(datetime.now().month)
        Distribution_of_Liabilities_User_Last_Month = user.get_expenditure_dict(datetime.now().month - 1 if datetime.now().month>1 else 12)

        Timeline_User = []
        last_seven_expenditures_user = Expenditure.objects.filter(user = user).order_by('-date')[:7]
        for val in last_seven_expenditures_user:
            Timeline_User.append({
                "user": UserSerializer(val.user).data,
                "liability": LiabilitySerializer(val.spent_on).data,
                "date": val.date.strftime("%d/%m/%Y"),
                "amount": val.amount
            })


        return Response({
                "LiabilityMap": Liability_map,
                "Expenditure_User": Expenditure_User,
                "Income_User": Income_User,
                "BarChartDataUser": Bar_Chart_Data_User,
                "DistributionOfLiabilitiesUser": Distribution_of_Liabilities_User,
                "DistributionOfLiabilitiesLastMonth": Distribution_of_Liabilities_User_Last_Month,
                "TimelineUser": Timeline_User,
                "GroupHead": False
        })

class GroupMember(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        group = user.group
        group_leader = user.group_leader

        if(group):
            if(group_leader):
                Last_Five_Months_Liability_Spend_Group = group.get_last_five_month_spend()
                Expenditure_Group = [sum(i.values()) for i in Last_Five_Months_Liability_Spend_Group]

                group_users = CustomUser.objects.filter(group = group)
                group_users = list(group_users)

                Income_Group = [0] * 5
                for i in group_users:
                    individul_income = [sum(j.values()) for j in i.get_last_five_month_income()]
                    Income_Group = [Income_Group[k] + individul_income[k] for k in range(5) ]


                Bar_Chart_Data_Group = {}

                for i in Last_Five_Months_Liability_Spend_Group:
                    for key,value in i.items():
                        if key in Bar_Chart_Data_Group:
                            Bar_Chart_Data_Group[key].append(value)
                        else:
                            Bar_Chart_Data_Group[key] = [value]

                Distribution_of_Liabilities_Group = group.liabilityspend(datetime.now().month)

                Timeline_Group = []

                last_seven_expenditures_group = Expenditure.objects.filter(user__in = group_users).order_by('date')[:7]
                for val in last_seven_expenditures_group:
                    Timeline_Group.append({
                        "user": UserSerializer(val.user).data,
                        "liability": LiabilitySerializer(val.spent_on).data,
                        "date": val.date.strftime("%m/%d/%Y"),
                        "amount": val.amount
                    })

                return Response({
                    "GroupMember": True,
                    "GroupHead": True,
                    "Expenditure_Group": Expenditure_Group,
                    "Income_Group": Income_Group,
                    "BarChartDataGroup": Bar_Chart_Data_Group,
                    "DistributionOfLiabilitiesGroup": Distribution_of_Liabilities_Group,
                    "TimelineGroup": Timeline_Group,
                })
            else:
                return


class AddExpenditure(APIView):
    def post(self, request, *args, **kwargs):
        # import pdb; pdb.set_trace()
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        amount = data["amount"]
        liability = data["liability"]
        date = data["date"]
        if not date:
            date = datetime.now()
        liability_object = Liability.objects.get(id = liability)
        date_object = datetime.strptime(date, "%d/%m/%Y")

        instance = Expenditure.objects.create(user = user, amount = amount, spent_on = liability_object, date = date_object)
        if instance:
            return Response({'success':True}, status = status.HTTP_200_OK)
        else:
            return Response({'success':False}, status = status.HTTP_404_NOT_FOUND)


class AddIncome(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        amount = data["amount"]
        source = data["source"]
        date = data["date"]
        if not date:
            date_object = datetime.now()
        date_object = datetime.strptime(date, "%d/%m/%Y")

        check = Income.objects.filter(user = user, date__month = datetime.now().month)
        # import pdb; pdb.set_trace()
        if(len(check) == 0):
            UserSavingsGoal.objects.create(user = user, date = datetime.now(), percentage = 100)

        instance = Income.objects.create(user = user, amount = amount, source = source, date = date_object)
        if instance:
            return Response({'sucess':True}, status = status.HTTP_200_OK)
        else:
            return Response({'success':False}, status = status.HTTP_404_NOT_FOUND)

class AddLiability(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        name = data['name']
        instance = Liability.objects.create(user = user, name = name)
        goal = UserGoal.objects.create(liability = instance, user = user, percentage = 0)
        if instance:
            return Response({'sucess':True, "id": instance.id}, status = status.HTTP_200_OK)
        else:
            return Response({'success':False}, status = status.HTTP_404_NOT_FOUND)

class GetLiabilityList(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        group = user.group
        LiabilityList = []
        if(user.group):
            group_users = CustomUser.objects.filter(group = group)
            liabilities = Liability.objects.filter(user__in = group_users)
            for i in liabilities:
                LiabilityList.append(LiabilitySerializer(i).data)

        else:
            liabilities = Liability.objects.filter(user = user)
            for i in liabilities:
                LiabilityList.append(LiabilitySerializer(i).data)

        return Response({
            "LiabilityList": LiabilityList
        })

class AlterGoals(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        for i in data["expenditure_goal"]:
            instance = UserGoal.objects.get(id = i.id)
            instance.goal = i.goal
            instance.save()
        instance = UserSavingsGoal.objects.get(user = user, date__month = datetime.now().month)
        instance.goal = data['savings_goal']
        instance.save()

        return Response({'sucess':True, "id": instance.id}, status = status.HTTP_200_OK)


class GetGoalStatus(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        all_goals = UserGoal.objects.filter(user = user)
        all_expenditures = user.get_expenditure_dict(datetime.now().month)
        income_this_month = Income.objects.filter(user = user, date__month = datetime.now().month).aggregate(Sum('amount'))
        if(income_this_month['amount__sum'] == None):
            return Response({
                "income": 0
            })
        goal_list = []
        # import pdb; pdb.set_trace()
        for i in all_goals:
            goal_list.append({
                "liability": LiabilitySerializer(i.liability).data,
                "goal": i.percentage
            })
        total_expenditure = sum([v['amount'] for k,v in all_expenditures.items()])
        saving_goal = UserSavingsGoal.objects.filter(user = user, date__month = datetime.now().month)
        if(saving_goal):
            saving_goal = saving_goal[0].percentage
        else:
            return Response({'success':False}, status = status.HTTP_404_NOT_FOUND)

        # if(len(all_goals) == 0):
        #     saving_goal = 100
        # else:
        #     saving_goal = 100 - all_goals.aggregate(Sum("percentage"))['percentage__sum']
        saving_reality = round(((income_this_month['amount__sum'] - total_expenditure) / income_this_month['amount__sum']) * 100 , 2 )

        return Response({
            "goal_list": goal_list,
            "income": income_this_month['amount__sum'],
            "all_expenditures": all_expenditures,
            "saving_goal": saving_goal,
            "saving_reality": saving_reality
        })

class UpdateGoals(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        selectedLiability = data['selected_liability']
        alter_savings = data['alter_savings']
        new_savings = data['new_savings']
        initial_setup = data['initial_setup']
        # import pdb; pdb.set_trace()

        for item in initial_setup:
            instance = UserGoal.objects.filter(user = user, liability__id = item['liability']['id'])[0]
            instance.percentage = item['goal']
            instance.save()

            instance = UserSavingsGoal.objects.filter(user = user, date__month = datetime.now().month)[0]
            instance.percentage = new_savings
            instance.save()

        return Response({'sucess':True}, status = status.HTTP_200_OK)







