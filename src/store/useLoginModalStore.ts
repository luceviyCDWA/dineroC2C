import { create } from "zustand";

interface LoginModalState {
  showModal: boolean;
  afterLoginSuccess: (() => void) | null;
  afterLoginFail: ((str: string) => void) | null;

  onShowLogin: () => Promise<void>;
  onHideLogin: (loginSuccess: boolean) => void;
}

const useLoginModalStore = create<LoginModalState>((set, get) => ({
  showModal: false,
  afterLoginSuccess: null,
  afterLoginFail: null,

  onShowLogin: () => {
    let resolveFn: (value: void | PromiseLike<void>) => void;
    let rejectFn: (value: string) => void;

    const loginPromise = new Promise<void>((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    set((state) => ({
      ...state,
      showModal: true,
      afterLoginSuccess: resolveFn,
      afterLoginFail: rejectFn, 
    }));

    return loginPromise;
  },

  onHideLogin: (isSucess) => {
    const { afterLoginSuccess, afterLoginFail } = get();

    if (isSucess) {
      afterLoginSuccess && afterLoginSuccess();
    } else {
      afterLoginFail && afterLoginFail('loginFail');
    }

    set((state) => ({
      ...state,
      showModal: false,
      afterLoginSuccess: null,
      afterLoginFail: null,
    }));
  },
}));

export default useLoginModalStore;
