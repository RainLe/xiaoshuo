import os
from django.conf import settings
from pathlib import Path
from rest_framework import viewsets, filters
from rest_framework.response import Response
from .models import Category, Item, Chapter
from .serializers import CategorySimpleSerializer, ItemSerializer, ChapterSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """
    栏目增删改查 API
    """
    queryset = Category.objects.all()
    serializer_class = CategorySimpleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ItemViewSet(viewsets.ModelViewSet):
    """
    文章增删改查及多条件查询 API
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['pub_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class ChapterViewSet(viewsets.ModelViewSet):
    """
    章节增删改查及按文章筛选 API
    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        item_id = self.request.query_params.get('item_id')
        if item_id:
            queryset = queryset.filter(item_id=item_id)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data.copy()
        file_path = Path(__file__).parent.parent / instance.content_file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"Reading content =: {content}")
        data['content'] = content
        return Response(data)
