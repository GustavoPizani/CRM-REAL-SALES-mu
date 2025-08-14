import Link from 'next/link';
import { Button } from 'ui';
import { Plus } from 'lucide-react';

export default function PropertiesPage() {
  return (
    <div>
      <Button asChild>
        <Link href="/properties/new">
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Link>
      </Button>
      {/* rest of code here */}
    </div>
  );
}
