from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from django.contrib.auth import authenticate
from .models import Booking, Office, AdminProfile
from .serializers import BookingSerializer, OfficeSerializer, AdminProfileSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        email = self.request.query_params.get('email', None)
        if email is not None:
            queryset = queryset.filter(email__icontains=email)
        return queryset

class OfficeViewSet(viewsets.ModelViewSet):
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer

class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer

@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # Allow login if superuser OR has AdminProfile
        is_admin_profile = AdminProfile.objects.filter(user=user).exists()
        
        if user.is_superuser or is_admin_profile:
            return Response({'status': 'success', 'message': 'Login successful'})
        else:
            return Response({'status': 'error', 'message': 'User is not an admin'}, status=403)
    else:
        return Response({'status': 'error', 'message': 'Invalid credentials'}, status=401)
