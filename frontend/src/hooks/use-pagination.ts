import { useState } from 'react';
import {
  keepPreviousData,
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query';
import { mainInstance } from '@/07_instances/main-instance';

type options = {
  extendedParams?: string;
  staleTime?: number;
};

const usePagination = (
  endpoint: string,
  defaultSort: string,
  options?: options,
) => {
  // const queryClient = useQueryClient();

  const [limit, setLimit] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState(defaultSort);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { isLoading, isFetching, error, data, refetch } = useQuery({
    queryKey: [
      endpoint,
      searchTerm,
      limit,
      currentPage,
      sort,
      options?.extendedParams,
    ],
    queryFn: async ({ signal }) => {
      const res = await mainInstance.get(
        `${endpoint}?search=${searchTerm}&limit=${limit}&page=${currentPage}&sort=${sort}${options?.extendedParams ? `&${options?.extendedParams}` : ''}`,
        { signal },
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: options?.staleTime || 0,
    // enabled: !queryClient.getQueryData([
    //   endpoint,
    //   searchTerm,
    //   limit,
    //   currentPage,
    //   sort,
    //   options?.extendedParams,
    // ]),
  });

  return {
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    isLoading,
    isFetching,
    error,
    data,
    refetch,
    info: data?.info || { total: 0, pages: 1 },
  };
};

export default usePagination;
