
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DateTimeSelector from '../components/DateTimeSelector';
import './BookingPage.css';
import bgImage from '../assets/booking_ui.png';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedOffice = location.state?.office || 'Selected Office';
    const officeNameMap = {
        'trichy': 'VDart GCC, Trichy',
        'bangalore': 'VDart Digital, Bangalore',
        'chennai': 'VDart Digital, Chennai',
        'atlanta': 'VDart, US Atlanta'
    };

    const displayName = officeNameMap[selectedOffice] || selectedOffice;

    const [step, setStep] = useState(1); // 1: Details, 2: DateTime
    const [userType, setUserType] = useState('employee'); // 'employee' or 'visitor'
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        vehicleType: 'car',
        vehicleNo: '',
        purpose: '',
        passType: 'daily' // Default to daily
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();

        // Email Validation for Employees
        if (userType === 'employee') {
            const allowedDomains = ['vdartacademy.com', 'vdartinc.com', 'vdartdigital.com'];
            const emailDomain = formData.email.split('@')[1];

            if (!emailDomain || !allowedDomains.includes(emailDomain)) {
                alert('Invalid Email Domain. Allowed: ' + allowedDomains.join(', '));
                return;
            }
        }

        setStep(2);
    };

    const handleBookingConfirm = async (displayDate, slot, dateData) => {
        // dateData contains { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }

        const bookingPayload = {
            office: selectedOffice,
            user_type: userType,
            employee_id: formData.employeeId,
            pass_type: formData.passType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            vehicle_type: formData.vehicleType,
            vehicle_no: formData.vehicleNo,
            purpose: formData.purpose,
            // Store standardized range: "YYYY-MM-DD" or "YYYY-MM-DD/YYYY-MM-DD"
            booking_date: dateData.start === dateData.end ? dateData.start : `${dateData.start}/${dateData.end}`,
            time_slot: slot
        };

        try {
            const response = await axios.post('/api/bookings/', bookingPayload);
            console.log('Booking Success:', response.data);
            alert('Booking Confirmed! ID: ' + response.data.id);
            navigate('/'); // Go back home
        } catch (error) {
            console.error('Booking Error:', error);
            alert('Failed to submit booking. Check console for details.');
        }
    };

    return (
        <div className="booking-container">
            {/* Main Content Panel */}
            <div className="booking-form-panel">
                <div className="booking-header">
                    <button className="back-link" onClick={() => step === 1 ? navigate('/') : setStep(1)}>
                        {step === 1 ? '← Home' : '← Back to Details'}
                    </button>
                </div>

                {step === 1 ? (
                    <>
                        <h3 className="form-title">Booking Information</h3>

                        <div className="user-type-selector">
                            <button
                                className={'type-btn ' + (userType === 'employee' ? 'active' : '')}
                                onClick={() => setUserType('employee')}
                            >
                                Employee
                            </button>
                            <button
                                className={'type-btn ' + (userType === 'visitor' ? 'active' : '')}
                                onClick={() => setUserType('visitor')}
                            >
                                Visitor
                            </button>
                        </div>

                        <form onSubmit={handleNextStep} className="form-grid">

                            {/* Employee Specific: ID */}
                            {userType === 'employee' && (
                                <>
                                    <div className="form-group">
                                        <label>Employee ID <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            className="form-input"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Pass Type <span className="required">*</span></label>
                                        <select
                                            name="passType"
                                            className="form-select"
                                            value={formData.passType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="daily">Daily Pass</option>
                                            <option value="monthly">Monthly Pass</option>
                                            <option value="yearly">Yearly Pass</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Common: Name */}
                            <div className="form-group">
                                <label>{userType === 'employee' ? 'Employee Name' : 'Visitor Name'} <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* Common: Phone */}
                            <div className="form-group">
                                <label>Mobile Number <span className="required">*</span></label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select className="form-select" style={{ width: '80px' }}>
                                        <option>+91</option>
                                        <option>+1</option>
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        style={{ flex: 1 }}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Common: Email */}
                            <div className="form-group">
                                <label>Email Address <span className="required">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                {userType === 'employee' && (
                                    <small style={{ color: '#999', marginTop: '4px', fontSize: '0.75rem' }}>Allowed domains: vdartacademy.com, vdartinc.com, vdartdigital.com</small>
                                )}
                            </div>

                            {/* Visitor Specific: Purpose */}
                            {userType === 'visitor' && (
                                <div className="form-group full-width">
                                    <label>Purpose of Visit <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="purpose"
                                        className="form-input"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}

                            {/* Common: Vehicle Info */}
                            <div className="form-group">
                                <label>Type of Vehicle <span className="required">*</span></label>
                                <select
                                    name="vehicleType"
                                    className="form-select"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                >
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Vehicle Number <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="vehicleNo"
                                    className="form-input"
                                    placeholder="e.g., TN-XX-YY-1234"
                                    value={formData.vehicleNo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-actions full-width">
                                <button type="submit" className="submit-btn">Next</button>
                            </div>

                        </form>
                    </>
                ) : (
                    <DateTimeSelector
                        onBack={() => setStep(1)}
                        onConfirm={handleBookingConfirm}
                    />
                )}
            </div>
        </div>
    );
};

export default BookingPage;
