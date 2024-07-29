import { useState } from "react";

import request from '@/utils/request';
import { DEFAULT_PAGE_SIZE, INIT_PAGE } from "@/config/env";

export default function useListData<T = unknown>(options: {
  api: string;
  type: 'get' | 'post';
  pageSize?: number;
  extraInfo?: Record<string, unknown>;
  dataFormat?: (data: unknown[], curPage: number) => Promise<T[]>;
}) {
  const [dataList, setDataList] = useState<Array<T>>([]);
  const [totalPage, setTotalPage] = useState(INIT_PAGE); 
  const [page, setPage] = useState(INIT_PAGE - 1);

  const { api, type, pageSize = DEFAULT_PAGE_SIZE, extraInfo = {}, dataFormat } = options;

  const getNextPageList = async (curPage: number) => {
    if (curPage > totalPage) {
      return;
    }

    const params = {
      pageSize,
      page: curPage,
      ...extraInfo,
    };

    // const res = await request<
    //   unknown,
    //   {
    //     pageTotal: number;
    //     data: unknown[];
    //   }
    // >({
    //   url: api,
    //   method: type,
    //   data: params,
    //   params: params,
    // });
    const res = {
      data: [1,1,1,1,1,1,1,1,1],
      pageTotal: 5,
    }

    let resultList: T[];

    if (dataFormat) {
      resultList = await dataFormat(res.data, curPage);
    } else {
      resultList = res.data as T[];
    }

    setDataList([...dataList, ...resultList]);
    setTotalPage(res.pageTotal);
    setPage(curPage);
  }

  const resetData = async () => {
    setDataList([]);
    setTotalPage(INIT_PAGE + 1);
    
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