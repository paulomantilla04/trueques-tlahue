import { FeaturedProducts } from '@/components/home/productsCarousel';
import { ProductGrid } from '@/components/home/productGrid';
import { type ProductCondition } from '@/hooks/useProducts';

interface HomeProps {
  searchParams: {
    q?: string | string[];
    condition?: string | string[];
  }
}

export default function Home({ searchParams }: HomeProps) {
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const condition = typeof searchParams.condition === 'string' ? (searchParams.condition as ProductCondition) : undefined;

  return (
    <div className="min-h-screen bg-[#FCF5F1]">
      <FeaturedProducts />
      <ProductGrid search={search} condition={condition} />
    </div>
  );
}
