import React from 'react';

/**
 * Static placeholder for the booking UI.
 * No logic, just layout matching the final design.
 */
const BookingPlaceholder: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Service Selection */}
      <section className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Select a Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-gray-100 rounded p-2 text-center">Haircut</div>
          <div className="bg-gray-100 rounded p-2 text-center">Color</div>
          <div className="bg-gray-100 rounded p-2 text-center">Styling</div>
          <div className="bg-gray-100 rounded p-2 text-center">Treatment</div>
        </div>
      </section>

      {/* Calendar / Date Picker */}
      <section className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Choose a Date</h2>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => (
            <div key={day} className="font-medium">{day}</div>
          ))}
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} className="p-2 rounded hover:bg-gray-200 cursor-pointer">{i + 1}</div>
          ))}
        </div>
      </section>

      {/* Time Slot Selection */}
      <section className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Select a Time</h2>
        <div className="flex flex-wrap gap-2">
          {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'].map((time) => (
            <div key={time} className="bg-gray-100 rounded p-2">{time}</div>
          ))}
        </div>
      </section>

      {/* Customer Information Form */}
      <section className="border rounded-lg p-4 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        <input type="text" placeholder="Full Name" className="w-full border rounded p-2" disabled />
        <input type="email" placeholder="Email Address" className="w-full border rounded p-2" disabled />
        <input type="tel" placeholder="Phone Number" className="w-full border rounded p-2" disabled />
      </section>

      {/* Confirmation Section */}
      <section className="border rounded-lg p-4 shadow-sm text-center">
        <h2 className="text-xl font-semibold mb-2">Confirm Your Booking</h2>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>
          Confirm (Disabled)
        </button>
      </section>
    </div>
  );
};

export default BookingPlaceholder;