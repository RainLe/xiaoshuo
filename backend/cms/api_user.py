from .models import Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role', 'reader')
        if not username or not password:
            return Response({'error': '用户名和密码不能为空'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': '用户名已存在'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        # 创建Profile并设置角色
        from .models import Profile
        Profile.objects.create(user=user, role=role)
        return Response({'success': True})

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=400)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        profile = Profile.objects.filter(user=user).first()
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': profile.role if profile else 'reader',
        })
    def post(self, request):
        user = request.user
        user.email = request.data.get('email', user.email)
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.save()
        return Response({'success': True})
