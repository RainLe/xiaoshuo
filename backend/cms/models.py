
from django.db import models

class Category(models.Model):
	"""
	栏目实体对象，表示文章所属的分类。
	"""
	name = models.CharField(max_length=32, unique=True, verbose_name="栏目名称")
	description = models.CharField(max_length=128, unique=True, verbose_name="栏目描述")
	@property
	def items(self):
		"""
		返回该文章的所有章节列表。
		"""
		return Item.objects.filter(category_id=self.id).order_by('pub_date desc')


	class Meta:
		verbose_name = "栏目"
		verbose_name_plural = "栏目"
		db_table = "category"


	def __str__(self):
		return self.name




class Item(models.Model):
	"""
	文章实体对象，包含题目、发表时间、所属栏目等。
	"""
	title = models.CharField(max_length=200, verbose_name="文章题目")
	summary = models.CharField(max_length=512, blank=True, verbose_name="文章摘要")
	pub_date = models.DateTimeField(auto_now_add=True, verbose_name="发表时间")
	category_id = models.IntegerField(verbose_name="所属栏目ID")
	@property
	def chapters(self):
		"""
		返回该文章的所有章节列表。
		"""
		return Chapter.objects.filter(item_id=self.id).order_by('order')

	class Meta:
		verbose_name = "文章"
		verbose_name_plural = "文章"
		db_table = "item"


	def __str__(self):
		return self.title


class Chapter(models.Model):
	"""
	章节实体对象，属于某一文章，每章内容存储在文档里，数据库保存文件路径。
	"""
	item_id = models.IntegerField(verbose_name="所属文章ID")
	title = models.CharField(max_length=200, verbose_name="章节标题")
	content_file = models.CharField(max_length=255, verbose_name="内容文件路径")
	order = models.PositiveIntegerField(verbose_name="章节序号")
	class Meta:
		verbose_name = "章节"
		verbose_name_plural = "章节"
		db_table = "chapter"

	def __str__(self):
		return f"{self.item.title} - {self.title}"
