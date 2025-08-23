import os
from django.conf import settings
from pathlib import Path
from rest_framework import viewsets, filters
from rest_framework.response import Response
from django.db import models
from .models import Category, Item, Chapter, Profile
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
        user = self.request.user
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        # 权限过滤
        if not user.is_authenticated:
            return queryset.none()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = int(request.query_params.get('page', 1))
        size = int(request.query_params.get('size', 10))
        total = queryset.count()
        start = (page - 1) * size
        end = start + size
        page_items = queryset[start:end]
        serializer = self.get_serializer(page_items, many=True)
        return Response({
            'total': total,
            'data': serializer.data,
            'page': page,
            'size': size
        })

    def create(self, request, *args, **kwargs):
        title = request.data.get('name') or request.data.get('title')
        summary = request.data.get('summary', '')
        category_id = request.data.get('category_id', 1)
        user = request.user if request.user else None
        author_id = user.id if user else 0
        item = Item.objects.create(
            title=title,
            summary=summary,
            category_id=category_id,  # 可根据实际需求调整
            author_id=author_id,
            status='published'
        )
        serializer = self.get_serializer(item)
        return Response(serializer.data)


class ChapterViewSet(viewsets.ModelViewSet):
    """
    章节增删改查及按文章筛选 API
    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        item_id = self.request.query_params.get('item_id')
        item = Item.objects.filter(id=item_id).first()
        if item_id:
            queryset = queryset.filter(item_id=item_id)
        user = self.request.user

        profile = Profile.objects.filter(user=user).first()
        role = profile and profile.role or 'reader'
        if role == 'reader':
            queryset = queryset.filter(status='published')
        elif role == 'author':
            if item and item.author_id != user.id:
                queryset = queryset.filter(status='published')
        elif role == 'editor':
            pass  # 编辑可看全部
        else:
            queryset = queryset.filter(status='published')

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = int(request.query_params.get('page', 1))
        size = int(request.query_params.get('size', 10))
        total = queryset.count()
        start = (page - 1) * size
        end = start + size
        page_items = queryset[start:end]
        serializer = self.get_serializer(page_items, many=True)
        return Response({
            'total': total,
            'data': serializer.data,
            'page': page,
            'size': size
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data.copy()
        file_path = Path(__file__).parent.parent / instance.content_file
        print('file_path:', file_path)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            content = ''
        data['content'] = content
        return Response(data)

    def create(self, request, *args, **kwargs):
        # 新增章节
        item_id = request.data.get('item_id')
        title = request.data.get('title')
        content = request.data.get('content', '')
        order = request.data.get('order', 1)
        status = request.data.get('status', 'draft')
        refuse_reason = request.data.get('refuse_reason', '')
        # 保存内容到文件
        file_name = f'chapter_{item_id}_{order}.txt'
        file_path = Path(settings.BASE_DIR) / 'content_files' / file_name
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        chapter = Chapter.objects.create(
            item_id=item_id,
            title=title,
            content_file=str(file_path.relative_to(Path(settings.BASE_DIR))),
            order=order,
            status=status,
            refuse_reason=refuse_reason
        )
        serializer = self.get_serializer(chapter)
        data = serializer.data.copy()
        data['content'] = content
        return Response(data)

    def update(self, request, *args, **kwargs):
        # 编辑章节
        partial = kwargs.pop('partial', False)
        # title = request.data.get('title', instance.title)
        # category_id = request.data.get('category_id')
        # instance = Category.objects.filter(id=category_id).first()
        instance = self.get_object()
        title = request.data.get('title', instance.title)
        content = request.data.get('content', '')
        order = request.data.get('order', instance.order)
        status = request.data.get('status', instance.status)
        refuse_reason = request.data.get('refuse_reason', instance.status)

        instance.title = title
        instance.order = order
        instance.status = status
        instance.refuse_reason = refuse_reason

        # 更新内容文件
        file_path = Path(settings.BASE_DIR) / instance.content_file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        instance.save()
        serializer = self.get_serializer(instance)
        data = serializer.data.copy()
        data['content'] = content
        return Response(data)
