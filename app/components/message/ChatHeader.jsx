'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatHeader({ conversation, productImage, otherUserName }) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
      <button
        onClick={() => router.push('/messages')}
        className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-xl transition"
      >
        <ArrowLeft size={16} />
      </button>

      <Link href={`/listings/${conversation.listingId}`} className="flex-1 flex items-center gap-3 min-w-0 group">
        {productImage ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
            <Image src={productImage} alt={conversation.productName} width={40} height={40} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
            <Package size={16} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors duration-150">
            {conversation.productName}
          </p>
          <p className="text-[11px] font-semibold text-slate-400 truncate">
            chat with <span className="text-slate-600 font-bold">{otherUserName}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}