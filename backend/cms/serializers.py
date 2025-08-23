from rest_framework import serializers
from .models import Category, Item, Chapter


class CategorySimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']



class ItemSerializer(serializers.ModelSerializer):
    category = CategorySimpleSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Item
        fields = ['id', 'title', 'summary', 'pub_date', 'category', 'category_id', 'author_id', 'status']


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'item_id', 'title', 'content_file', 'order', 'status',  'refuse_reason']
