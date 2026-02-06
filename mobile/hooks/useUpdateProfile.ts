import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";
import { useAuthUserStore } from "@/store/authUser";
import Toast from "react-native-toast-message";

interface Payload {
  id: string;
  name?: string;
  contactNumber?: string;
  username?: string;
  address?: string[];
  currentAddress?: string;
}
export const useUpdateProfile = () => {
  const { setUser } = useAuthUserStore();

  return useMutation({
    mutationFn: async ({ id, ...data }: Payload) => {
      const res = await api.patch(`/user/${id}`, data, {
        withCredentials: true,
      });
      return res.data;
    },

    onSuccess: (data) => {
      setUser(data);
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
        position: "top",
        topOffset: 60,
      });
    },
  });
};
