
from django.contrib import admin
from .models import Category, Item


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "description")
	search_fields = ("name",)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "pub_date", "category_id")
	search_fields = ("title",)
	list_filter = ("category_id", "pub_date")
