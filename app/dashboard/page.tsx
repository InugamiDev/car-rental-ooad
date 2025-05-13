const DashboardPage = () => {
  const sampleBookings = [
    { id: 'B001', car: 'Toyota Camry', user: 'John Doe', startDate: '2024-06-01', endDate: '2024-06-03', status: 'Confirmed' },
    { id: 'B002', car: 'Honda Civic', user: 'Jane Smith', startDate: '2024-06-05', endDate: '2024-06-07', status: 'Pending' },
    { id: 'S001', car: 'Ford Mustang', user: 'Alice Brown', saleDate: '2024-05-20', status: 'Completed' },
  ];

  const sampleListings = [
    { id: 'C001', name: 'Toyota Camry', type: 'Sedan', status: 'Available', price: '$25,000 / $70 day' },
    { id: 'C002', name: 'Honda Civic', type: 'Hatchback', status: 'Rented', price: '$60 day' },
    { id: 'C003', name: 'Ford Mustang', type: 'Coupe', status: 'Sold', price: '$45,000' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Bookings & Sales</h2>
          <button className="bg-[#0057D9] hover:bg-[#004ABF] text-white py-2 px-4 rounded-md text-sm">
            View All
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Vehicle</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">User/Customer</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Dates</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleBookings.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border text-sm">{item.id}</td>
                  <td className="px-4 py-2 border text-sm">{item.car}</td>
                  <td className="px-4 py-2 border text-sm">{item.user}</td>
                  <td className="px-4 py-2 border text-sm">{item.startDate ? `${item.startDate} - ${item.endDate}` : item.saleDate}</td>
                  <td className="px-4 py-2 border text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Confirmed' || item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2 text-xs">View</button>
                    <button className="text-red-600 hover:text-red-800 text-xs">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Manage Listings</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm">
            Add New Vehicle
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Price / Rate</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 border text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-4 py-2 border text-sm">{listing.id}</td>
                  <td className="px-4 py-2 border text-sm">{listing.name}</td>
                  <td className="px-4 py-2 border text-sm">{listing.type}</td>
                  <td className="px-4 py-2 border text-sm">{listing.price}</td>
                   <td className="px-4 py-2 border text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      listing.status === 'Available' ? 'bg-green-100 text-green-700' :
                      listing.status === 'Rented' ? 'bg-yellow-100 text-yellow-700' : 
                      listing.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2 text-xs">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;