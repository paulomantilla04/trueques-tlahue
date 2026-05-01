import { FeaturedProducts } from '@/components/home/productsCarousel';
import { ProductGrid } from '@/components/home/productGrid';
import { type ProductCondition } from '@/hooks/useProducts';

interface HomeProps {
  searchParams: Promise<{
    q?: string | string[];
    condition?: string | string[];
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const search = typeof params.q === 'string' ? params.q : undefined;
  const condition = typeof params.condition === 'string' ? (params.condition as ProductCondition) : undefined;

  return (
    <div className="min-h-screen bg-[#FCF5F1]">
      <FeaturedProducts />
      <ProductGrid search={search} condition={condition} />
    </div>
  );
}
