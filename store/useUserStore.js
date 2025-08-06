import { create } from 'zustand';

const useUserStore = create((set) => ({
  nickName: '',
  memberId: null, // 또는 0으로 초기화해도 OK
  setNickName: (name) => set({ nickName: name }),
  setMemberId: (id) => set({ memberId: id }),
}));

export default useUserStore;
