from django.db import models
from django.contrib.auth.models import User

class Booking(models.Model):
    USER_TYPE_CHOICES = [
        ('employee', 'Employee'),
        ('visitor', 'Visitor'),
    ]

    office = models.CharField(max_length=100)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    
    # Employee Specific
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    
    PASS_TYPE_CHOICES = [
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    pass_type = models.CharField(max_length=10, choices=PASS_TYPE_CHOICES, default='daily')
    
    # Common
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=20)
    vehicle_no = models.CharField(max_length=20)
    
    # Visitor Specific
    purpose = models.CharField(max_length=200, blank=True, null=True)
    
    # Booking Details
    booking_date = models.CharField(max_length=50) # Storing as string for simplicity with frontend format initially
    time_slot = models.CharField(max_length=50)
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    # Slot allocation
    allocated_slot = models.CharField(max_length=10, blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.booking_date} ({self.office})"

class Office(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.location}"

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    admin_code = models.CharField(max_length=20, unique=True)
    office = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    mobile = models.CharField(max_length=20)
    shift = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} ({self.admin_code})"
