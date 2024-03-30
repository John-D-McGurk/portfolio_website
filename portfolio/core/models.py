from django.db import models

# Create your models here.

class Project(models.Model):
    featured = models.BooleanField(default=False)
    title = models.CharField(max_length=64)
    description = models.TextField()
    technologies = models.ManyToManyField(
        to='core.Technology',
        related_name='projects')
    image = models.ImageField(upload_to='project_img')
    github_link = models.URLField(max_length=64, default='https://github.com/John-D-McGurk')
    live_link = models.CharField(max_length=64, blank=True)

    def __str__(self):
        return self.title


class Technology(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name