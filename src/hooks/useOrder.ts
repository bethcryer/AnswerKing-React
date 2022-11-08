import { OrderDto } from 'dtos/OrderDto';
import { OrderItemUpdateDto } from 'dtos/OrderItemUpdateDto';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { orderService, ProblemDetails } from 'services/orderService';

type AddItemToOrderArgs = { orderId: number; itemId: number };
type RemoveItemFromOrderArgs = { orderId: number; itemId: number };
type UpdateOrderItemArgs = { orderId: number; itemId: number; updateDto: OrderItemUpdateDto };

interface UseOrderResult {
  order: UseQueryResult<OrderDto>;
  getOrder: UseMutationResult<OrderDto, ProblemDetails, number>;
  createOrder: UseMutationResult<OrderDto, ProblemDetails, void>;
  clearOrder(): void;
  addItemToOrder: UseMutationResult<void, void, AddItemToOrderArgs>;
  removeItemFromOrder: UseMutationResult<void, void, RemoveItemFromOrderArgs>;
  updateOrderItemQuantity: UseMutationResult<void, void, UpdateOrderItemArgs>;
}

export const useOrder = (): UseOrderResult => {
  const queryClient = useQueryClient();

  const order = useQuery<OrderDto>(['order'], { enabled: false });

  const getOrder = useMutation<OrderDto, ProblemDetails, number>((id) => orderService.getById(id), {
    onSuccess: (orderDto) => {
      queryClient.setQueryData(['order'], orderDto);
    },
  });

  const createOrder = useMutation<OrderDto, ProblemDetails, void>(() => orderService.create(), {
    onSuccess: (orderDto) => {
      queryClient.setQueryData(['order'], orderDto);
    },
  });

  const clearOrder = (): Promise<void> => queryClient.resetQueries(['order']);

  const addItemToOrder = useMutation<void, void, AddItemToOrderArgs>(
    ({ itemId, orderId }) => orderService.addItem(orderId, itemId),
    {
      onSuccess: (_, { orderId }) => {
        getOrder.mutate(orderId);
      },
    }
  );

  const removeItemFromOrder = useMutation<void, void, RemoveItemFromOrderArgs>(
    ({ itemId, orderId }) => orderService.removeItem(orderId, itemId),
    {
      onSuccess: (_, { orderId }) => {
        getOrder.mutate(orderId);
      },
    }
  );

  const updateOrderItemQuantity = useMutation<void, void, UpdateOrderItemArgs>(
    ({ itemId, orderId, updateDto }) => orderService.updateOrderItem(orderId, itemId, updateDto),
    {
      onSuccess: (_, { orderId }) => {
        getOrder.mutate(orderId);
      },
    }
  );

  return { order, getOrder, createOrder, clearOrder, addItemToOrder, removeItemFromOrder, updateOrderItemQuantity };
};
