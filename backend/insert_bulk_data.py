import os
import django
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms_backend.settings')
django.setup()

from cms.models import Category, Item, Chapter

CONTENT_DIR = 'content_files'
if not os.path.exists(CONTENT_DIR):
    os.makedirs(CONTENT_DIR)

category_names = [
    ('短剧', '热门短剧剧本发布'),
    ('小说', '原创小说连载与发布'),
    ('剧本', '舞台剧、影视剧本分享'),
]

# 创建栏目
categories = []

for name, desc in category_names:
    cat, _ = Category.objects.get_or_create(name=name, description=desc)
    categories.append(cat)

for cat in categories:
    for i in range(1, 11):
        item = Item.objects.create(title=f'{cat.name}示例文章{i}', category_id=cat.id, summary=f'文章摘要')
        for j in range(1, 11):
            chapter_title = f'我是章节{j}'
            content = f'{chapter_title}\n内容示例：这是{cat.name}第{i}篇文章的第{j}章内容。' + '\n' * 2 + '正文内容略...'
            file_name = f'{cat.name}_item{i}_chapter{j}.txt'
            file_path = os.path.join(CONTENT_DIR, file_name)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            Chapter.objects.create(item_id=item.id, title=chapter_title, content_file=file_path, order=j)
print('已批量生成栏目、文章和章节数据。')
