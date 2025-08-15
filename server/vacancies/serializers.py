from rest_framework import serializers
from .models import Vacancy

class VacancyListSerializer(serializers.ModelSerializer):
    salary_display = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = (
            "id","slug","title","department","location","employment_type",
            "seniority","salary_display","is_active","published_at"
        )

    def get_salary_display(self, obj):
        if obj.salary_min and obj.salary_max:
            return f"{obj.salary_min:,}–{obj.salary_max:,} {obj.currency}".replace(",", " ")
        if obj.salary_min:
            return f"от {obj.salary_min:,} {obj.currency}".replace(",", " ")
        if obj.salary_max:
            return f"до {obj.salary_max:,} {obj.currency}".replace(",", " ")
        return None

class VacancyDetailSerializer(serializers.ModelSerializer):
    salary_display = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = (
            "id","slug","title","department","location","employment_type","seniority",
            "salary_min","salary_max","currency","salary_display",
            "description","tags","apply_url","apply_email",
            "published_at","expire_at","is_active"
        )

    def get_salary_display(self, obj):
        return VacancyListSerializer.get_salary_display(self, obj)