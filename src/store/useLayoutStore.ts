import { create } from 'zustand';

interface LayoutStoreState {
  whatever: boolean;

  setWhatever: () => void;
}

const LayoutStore = create<LayoutStoreState>((set) => ({
  whatever: false,

  setWhatever: () => {
    set(state => ({ ...state, whatever: !state.whatever }));
  }
}));

export default LayoutStore;
