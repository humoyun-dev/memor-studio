
from django.urls import path
from . import views

urlpatterns = [
    path('', views.team_page_data, name='team_page_data'),
    path('<int:member_id>/', views.team_member_detail, name='team_member_detail'),
]