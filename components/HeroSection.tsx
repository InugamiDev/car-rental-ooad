// import { SearchIcon, CalendarIcon, LocationMarkerIcon } from '@heroicons/react/outline'; // Assuming you might use Heroicons

const HeroSection = () => {
  return (
    <section
      className="bg-cover bg-center py-20 px-4 text-white"
      style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080.png?text=Vietnam+Landscape')" }} // Placeholder image
    >
      <div className="container mx-auto text-center bg-black bg-opacity-50 p-8 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Rent a Car in Vietnam, Get Rewarded for Every Kilometer!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          With our Driving Distance Exchange, your journey turns into savings.
        </p>
        <form className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-xl space-y-4 md:space-y-0 md:flex md:space-x-4 items-end">
          <div className="flex-grow">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 text-left">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Placeholder for LocationMarkerIcon */}
              </div>
              <input
                type="text"
                name="location"
                id="location"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-gray-300 rounded-md py-2 text-gray-900" // Adjusted padding
                placeholder="e.g., Ho Chi Minh City"
              />
            </div>
          </div>
          <div className="flex-grow">
            <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 text-left">Pick-up Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Placeholder for CalendarIcon */}
              </div>
              <input
                type="date"
                name="pickup-date"
                id="pickup-date"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-gray-300 rounded-md py-2 text-gray-900" // Adjusted padding
              />
            </div>
          </div>
          <div className="flex-grow">
            <label htmlFor="return-date" className="block text-sm font-medium text-gray-700 text-left">Return Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Placeholder for CalendarIcon */}
              </div>
              <input
                type="date"
                name="return-date"
                id="return-date"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-gray-300 rounded-md py-2 text-gray-900" // Adjusted padding
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition duration-150 ease-in-out flex items-center justify-center" // Adjusted padding for button
          >
            {/* Placeholder for SearchIcon */}
            Find My Ride & Earn Points
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;