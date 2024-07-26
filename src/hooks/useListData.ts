import { useState } from "react";

import request from '@/utils/request';
import { DEFAULT_PAGE_SIZE, INIT_PAGE } from "@/config/env";

export default function useListData<T = unknown>(options: {
  api: string;
  type: 'get' | 'post';
  pageSize?: number;
  dataFormat?: (data: unknown[]) => Promise<T[]>;
}) {
  const [dataList, setDataList] = useState<Array<T>>([]);
  const [totalPage, setTotalPage] = useState(INIT_PAGE); 
  const [page, setPage] = useState(INIT_PAGE - 1);

  const { api, type, pageSize = DEFAULT_PAGE_SIZE, dataFormat } = options;

  const getNextPageList = async (curPage: number) => {
    if (curPage >= totalPage) {
      return;
    }

    const params = {
      pageSize,
      page: curPage,
    };

    const res = await request<
      unknown,
      {
        pageTotal: number;
        data: unknown[];
      }
    >({
      url: api,
      method: type,
      data: params,
      params: params,
    });

    let resultList: T[];

    if (dataFormat) {
      resultList = await dataFormat(res.data);
    } else {
      resultList = res.data as T[];
    }

    setDataList([...dataList, ...resultList]);
    setTotalPage(res.pageTotal);
    setPage(curPage);
  }

  const resetData = async () => {
    setDataList([]);
    setTotalPage(1);
    
    await getNextPageList(INIT_PAGE);
  }

  return {
    dataList,
    page,
    totalPage,
    getNextPageList,
    resetData,
  };
}