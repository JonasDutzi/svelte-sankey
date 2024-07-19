export type WrapperStore = {
  height: number;
  width: number;
  top: number;
  left: number;
};

const createWrapperStore = () => {
  let wrapperStore = $state<WrapperStore>({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  });

  const set = (value: WrapperStore) => {
    wrapperStore = value;
  };

  return {
    get value() {
      return wrapperStore;
    },
    set,
  };
};

export const wrapperStore = createWrapperStore();
