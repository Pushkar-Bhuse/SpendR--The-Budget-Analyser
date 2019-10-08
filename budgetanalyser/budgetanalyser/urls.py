"""budgetanalyser URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include
# import analysis.views as analysis_views
from django.views.generic.base import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # path('admin/', admin.site.urls),
    # path('', analysis_views.home)
    # path('', TemplateView.as_view(template_name='home_page.html'), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('analysis.api.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls'), name="signup"),
    url(r'^rest-auth/', include('rest_auth.urls'), name="login"),
    path('users/', include('django.contrib.auth.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)