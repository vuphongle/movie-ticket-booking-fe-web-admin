import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import type { InputRef, TableColumnType } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

interface UseSearchTableReturn {
  getColumnSearchProps: (
    dataIndex: string,
    subDataIndex?: string[] | null
  ) => Partial<TableColumnType<any>>;
}

const useSearchTable = (): UseSearchTableReturn => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  const getNestedValue = (path: string[], object: any): any =>
    path.reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : null),
      object
    );

  const getColumnSearchProps = (
    dataIndex: string,
    subDataIndex: string[] | null = null
  ): Partial<TableColumnType<any>> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters: _clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
      const dataValue = subDataIndex
        ? getNestedValue([dataIndex, ...subDataIndex], record)
        : record[dataIndex];
      return dataValue
        ? dataValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  return { getColumnSearchProps };
};

export default useSearchTable;
