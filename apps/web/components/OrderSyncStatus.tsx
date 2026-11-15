'use client';

import { useEffect, useState } from 'react';
import type { SyncStatus } from '@joice/domain';
import { SYNC_STATUS_LABELS } from '@joice/domain';
import { apiFetch, type OrderResponse } from '@/lib/api';

export function OrderSyncStatus({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState<SyncStatus>(
    initialStatus as SyncStatus,
  );

  useEffect(() => {
    if (status === 'SYNCED' || status === 'NOT_APPLICABLE') {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const order = await apiFetch<OrderResponse>(`/orders/${orderId}`);
        const next = order.syncStatus as SyncStatus;
        setStatus(next);
        if (next === 'SYNCED' || next === 'NOT_APPLICABLE') {
          window.clearInterval(timer);
        }
      } catch {
        // mantém o último estado conhecido
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [orderId, status]);

  return (
    <span className={`sync-badge sync-badge--${status.toLowerCase()}`}>
      {SYNC_STATUS_LABELS[status] ?? status}
    </span>
  );
}
