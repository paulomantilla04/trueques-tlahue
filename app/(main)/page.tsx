import { FeaturedProducts } from '@/components/home/productsCarrusel';
import { Header } from '../../components/home/hearder';
import { ProductGrid } from '@/components/home/productGrid';
export default function Home() {
  
  return (
    <div className="min-h-screen  bg-[#FCF5F1]">
      <Header/>
      <FeaturedProducts/>
     < ProductGrid/>
    </div>
  );
}
