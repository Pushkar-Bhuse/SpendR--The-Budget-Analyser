from django.conf.urls import url
from .views import UserProfile,GetDashboardData,AddExpenditure,GetLiabilityList,AddIncome,GetGoalStatus,AddLiability, UpdateGoals
from rest_framework import routers

# router = routers.DefaultRouter()
# router.register('dashboard', GetDashboardData)


urlpatterns = [
    # path('land/',DisplayView.as_view(),name = 'display'),
    # path('signup/', SignUpView.as_view(), name='sign_up'),
    url('profile/', UserProfile.as_view(), name = 'profile'),
    url('dashboard/', GetDashboardData.as_view(), name = 'dashboard'),
    url('add_expenditure/', AddExpenditure.as_view(), name = 'add_expense'),
    url('add_income/', AddIncome.as_view(), name = 'add_income'),
    url('add_liability/', AddLiability.as_view(), name = 'add_liability'),
    url('liability-list/', GetLiabilityList.as_view(), name = 'liability_list'),
    url('goals/', GetGoalStatus.as_view(), name = 'goals'),
    url('update_goals/', UpdateGoals.as_view(), name = 'update_goals'),
]