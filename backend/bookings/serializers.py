from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Booking, Office, AdminProfile

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = '__all__'

class AdminProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = AdminProfile
        fields = ['id', 'user', 'username', 'password', 'email', 'admin_code', 'office', 'designation', 'mobile', 'shift']
        read_only_fields = ['user']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email', '')
        
        user = User.objects.create_user(username=username, password=password, email=email)
        admin_profile = AdminProfile.objects.create(user=user, **validated_data)
        return admin_profile

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['username'] = instance.user.username
        representation['email'] = instance.user.email
        return representation
