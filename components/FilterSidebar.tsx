const FilterSidebar = () => {
  return (
    <aside className="w-64 p-4 border-r">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Category</h3>
        <ul className="space-y-1">
          <li><label className="flex items-center"><input type="checkbox" className="mr-2 rounded-sm" /> For Sale</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2 rounded-sm" /> For Rent</label></li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Make</h3>
        <select className="w-full p-2 border rounded-md">
          <option>All Makes</option>
          <option>Toyota</option>
          <option>Honda</option>
          <option>Ford</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Price Range</h3>
        <input type="range" className="w-full" />
      </div>

      <button className="w-full bg-[#0057D9] text-white py-2 px-4 rounded-md hover:bg-[#004ABF]">
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;