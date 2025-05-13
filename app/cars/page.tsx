import FilterSidebar from '@/components/FilterSidebar';
import ListingGrid from '@/components/ListingGrid';

export default function CarsPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <FilterSidebar />
      <ListingGrid />
    </div>
  );
}