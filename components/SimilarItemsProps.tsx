import React, { useState, useEffect } from 'react';
import { useItemContext } from '@/context/ItemProvider';
import { Item } from '@/models/Item';
import ItemCard from '@/components/ItemCard';
import ShimmerWidget from '@/components/ShimmerWidget';

interface SimilarItemsProps {
  categoryId: number;
  subcategoryId: number;
  currentItemId: string;
}

const SimilarItems: React.FC<SimilarItemsProps> = ({ categoryId, subcategoryId, currentItemId }) => {
  const { items, isLoading } = useItemContext();
  const [similarItems, setSimilarItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchSimilarItems = () => {
      const filteredItems = items.filter((item) => {
        return (
          item.id !== currentItemId &&
          item.categoryId === categoryId &&
          item.subcategoryId === subcategoryId
        );
      });
      setSimilarItems(filteredItems);
    };

    if (items.length > 0 && categoryId && subcategoryId) {
      fetchSimilarItems();
    }
  }, [items, categoryId, subcategoryId, currentItemId]);

  if (isLoading || similarItems.length === 0) {
    return <ShimmerWidget count={4} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {similarItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default SimilarItems;