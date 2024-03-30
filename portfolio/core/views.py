from django.shortcuts import render
from .models import Project

# Create your views here.

def index(request):
    projects = list(Project.objects.filter(featured=True))
    for project in projects:
        project.tech_list = project.technologies.all()
        print(project.tech_list)
    return render(request, 'core/index.html', {
        'projects': projects})
