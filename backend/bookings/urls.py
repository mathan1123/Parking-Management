from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, OfficeViewSet, AdminProfileViewSet, admin_login

router = DefaultRouter()
router.register(r'bookings', BookingViewSet)
router.register(r'offices', OfficeViewSet)
router.register(r'admins', AdminProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/login/', admin_login, name='admin_login'),
]
