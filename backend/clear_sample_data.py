from cms.models import Category, Item

# 删除所有旧数据
Item.objects.all().delete()
Category.objects.all().delete()

print('已清空所有栏目和内容数据。')
