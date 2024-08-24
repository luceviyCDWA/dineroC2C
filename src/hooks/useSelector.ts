import { useRef } from "react";
import _ from "lodash";
import { shallow } from "zustand/shallow";

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
};

type OneOrMany<T> = T | readonly T[];

// zustand selector方法
//  保证： 
//    1.暴露的state，值不变化时，不会触发更新
//    2.ts类型传递
export default function useSelector<T extends object, Key extends keyof T>(selector: OneOrMany<Key>) {
  const prevState = useRef<Pick<T, Key>>({} as Pick<T, Key>);

  return function(state: T) {
    if (state) {
      const curState = _.pick(state, selector);

      return shallow(curState, prevState.current)
        ? prevState.current
        : (prevState.current = curState);
    }

    return prevState.current;
  }
}