"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { showToastify } from "@/hooks/showToastify";
import SupplierService from "@/service/supplier.service";
import { useDebounce } from "use-debounce";
import { ISupplierList } from "@/types/supplier";

interface ISupplierProviderProps {
  children: React.ReactNode;
}

interface ISupplierContextData {
  categories: any;
  suppliers: any;
  loadingSuppliers: boolean;
  search: string;
  hasMore: boolean;
  pageNumber: number;
  supplierCategoriesFilter: string;
  handleSetSearch: (e: any) => void;
  handleCategoryFilter: (categoryId: string) => void;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  setPageNumber: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setSupplierCategoriesFilter: Dispatch<SetStateAction<string>>;
}

export const SupplierContext = createContext<ISupplierContextData>(
  {} as ISupplierContextData,
);

export const useSupplierContext = () => useContext(SupplierContext);

export const SupplierProvider: React.FC<ISupplierProviderProps> = ({
  children,
}) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [supplierCategoriesFilter, setSupplierCategoriesFilter] = useState("");

  const [textSearched] = useDebounce(search, 1000);

  const getAllCategories = async () => {
    const res: any = await SupplierService.getSupplierCategories();
    return res;
  };

  const handleCategoryFilter = (categoryId: string) => {
    setLoadingSuppliers(true);
    setPageNumber(1);
    setSupplierCategoriesFilter((prevState) =>
      prevState === categoryId ? "" : categoryId,
    );
  };

  function handleSetSearch(e: any) {
    setLoadingSuppliers(true);
    setSearch(e.target.value);
    setPageNumber(1);
  }

  const handleResponse = (res: any) => {
    setLoadingSuppliers(false);
    setSuppliers(
      pageNumber === 1
        ? res.data.results
        : suppliers.concat(res?.data?.results),
    );
  };

  useEffect(() => {
    const getAllSuppliers = async (data: Partial<ISupplierList>) => {
      const res: any = await SupplierService.getSupplierList(data);

      if (res?.data?.totalPages === pageNumber) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      return res;
    };

    const data = {
      page: pageNumber,
      ...(textSearched && { name: textSearched }),
      ...(supplierCategoriesFilter && {
        supplierCategory: supplierCategoriesFilter,
      }),
    };

    getAllSuppliers(data)
      .then(handleResponse)
      .catch((error) => {
        if (error?.response?.data?.code === 401) {
          showToastify({ label: "Usuário não autenticado", type: "error" });
        }
      });
  }, [textSearched, pageNumber, supplierCategoriesFilter]);

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res?.data?.supplierCategories?.results))
      .catch((error) => {
        if (error?.response?.data?.code === 401) {
          showToastify({
            label: "Não autorizado. Por favor, autentique-se",
            type: "error",
          });
        }
        if (error?.response?.data?.code === 404) {
          showToastify({
            label: "Nenhuma categoria encontrada",
            type: "error",
          });
        }
      });
  }, []);

  return (
    <SupplierContext.Provider
      value={{
        loadingSuppliers,
        suppliers,
        categories,
        pageNumber,
        setPageNumber,
        search,
        setSearch,
        hasMore,
        setHasMore,
        handleSetSearch,
        handleCategoryFilter,
        supplierCategoriesFilter,
        setSupplierCategoriesFilter,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};
