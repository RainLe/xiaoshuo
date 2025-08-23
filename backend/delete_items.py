import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms_backend.settings')
django.setup()

from cms.models import Item

def delete_items():
    items = Item.objects.filter(id__gte=51, id__lte=60)
    count = items.count()
    items.delete()
    print(f"Deleted {count} items with id from 11 to 50.")

if __name__ == "__main__":
    delete_items()
