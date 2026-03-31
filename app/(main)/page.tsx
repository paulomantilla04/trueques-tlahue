import { FeaturedProducts } from '@/components/home/productsCarousel';
import { ProductGrid } from '@/components/home/productGrid';
export default function Home() {
  
  return (
    <div className="min-h-screen  bg-[#FCF5F1]">
      <FeaturedProducts/>
     < ProductGrid/>
    </div>
  );
}
