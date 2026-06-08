'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function createOrder(data: {
  namaPembeli: string;
  totalTagihan: number;
  metodePembayaran: string;
  items: any[];
  tipePesanan?: string;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        namaPembeli: data.namaPembeli,
        totalTagihan: data.totalTagihan,
        metodePembayaran: data.metodePembayaran,
        items: data.items as Prisma.InputJsonValue,
        tipePesanan: data.tipePesanan || 'REGULAR',
        status: 'Dikonfirmasi',
      },
    });
    
    revalidatePath('/pesanan');
    return { success: true, order };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Gagal membuat pesanan' };
  }
}

export async function getMyOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
