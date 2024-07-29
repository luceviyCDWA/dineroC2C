import { create } from "zustand";

interface LoginModalState {
  showModal: boolean;
  afterLogin: (() => void ) | null;

  onShowLogin: () => Promise<void>;
  onHideLogin: (loginSuccess: boolean) => void;
}

const useLoginModalStore = create<LoginModalState>((set, get) => ({
  showModal: false,
  afterLogin: null,

  onShowLogin: () => {
    let resolveFn: (value: void | PromiseLike<void>) => void;

    const loginPromise = new Promise<void>((resolve) => {
      resolveFn = resolve;
    });

    set(state => ({
      ...state,
      showModal: true,
      afterLogin: resolveFn,
    }));

    return loginPromise;
  },

  onHideLogin: (isSucess) => {
    if (!isSucess) {
      return;
    }

    const { afterLogin } = get();

    if (afterLogin) {
      afterLogin();
    }

    set(state => ({
      ...state,
      showModal: false,
      afterLogin: null,
    }));
  }
}));

export default useLoginModalStore;
