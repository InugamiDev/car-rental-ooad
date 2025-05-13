const CheckoutPage = () => {
  const summaryDetails = {
    itemName: 'Toyota Camry Rental (3 days)',
    pricePerDay: 70,
    days: 3,
    subtotal: 210,
    tax: 21,
    total: 231,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
          <form className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullName" id="fullName" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" name="address" id="address" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="city" id="city" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                <input type="text" name="zip" id="zip" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Payment Details</h3>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input type="text" name="cardNumber" id="cardNumber" placeholder="•••• •••• •••• ••••" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input type="text" name="expiryDate" id="expiryDate" placeholder="MM/YY" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                <input type="text" name="cvc" id="cvc" placeholder="•••" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{summaryDetails.itemName}</span>
                <span>${summaryDetails.pricePerDay * summaryDetails.days}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${summaryDetails.tax.toFixed(2)}</span>
              </div>
              <hr className="my-2"/>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${summaryDetails.total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-[#0057D9] hover:bg-[#004ABF] text-white font-bold py-3 px-4 rounded-md text-lg">
              Confirm and Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;