import { OrderItemDto } from './OrderItemDto';

export interface OrderDto {
  id: number;
  status: string;
  total: number;
  items: OrderItemDto[];
}
