import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

type DeleteOrderPayload = {
  _id: string;
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id }: DeleteOrderPayload) => {
      const res = await api.delete(`/orders/${_id}`);
      return res.data;
    },

    onSuccess: (_, variables) => {
      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Remove deleted order from cache if it exists
      queryClient.removeQueries({
        queryKey: ["order", variables._id],
      });
    },
  });
};
