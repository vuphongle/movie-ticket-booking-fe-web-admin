import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteCountryMutation } from "@/app/services/countries.service";
import useSearchTable from "@/hooks/useSearchTable";
import ModalUpdate from "./ModalUpdate";
import type { Country } from "@/types/movie.types";

interface CountryTableProps {
  data: Country[];
}

const CountryTable = ({ data }: CountryTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();
  const [open, setOpen] = useState(false);
  const [countryUpdate, setCountryUpdate] = useState<Country | null>(null);
  const [deleteCountry, { isLoading }] = useDeleteCountryMutation();

  const columns: ColumnsType<Country> = [
    {
      title: t("COUNTRY_NAME"),
      dataIndex: "name",
      key: "name",
      width: "70%",
      ...getColumnSearchProps("name"),
      sorter: (a: Country, b: Country) => a.name.localeCompare(b.name, "vi"),
      sortDirections: ["descend", "ascend"] as const,
      render: (text: string) => {
        return text;
      },
    },
    {
      title: t("ACTION"),
      dataIndex: "",
      key: "action",
      width: "30%",
      render: (_text, record: Country) => {
        return (
          <Flex justify={"end"}>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setCountryUpdate(record);
                  setOpen(true);
                }}
              ></Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  handleConfirm(record.id);
                }}
              ></Button>
            </Space>
          </Flex>
        );
      },
    },
  ];

  const handleConfirm = (id: string | number) => {
    Modal.confirm({
      title: t("DELETE_COUNTRY_CONFIRM_TITLE"),
      content: t("DELETE_CONFIRM_CONTENT"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      okButtonProps: { loading: isLoading },
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteCountry(id)
            .unwrap()
            .then(() => {
              message.success(t("DELETE_COUNTRY_SUCCESS"));
              resolve();
            })
            .catch((error) => {
              message.error(error.data.message);
              reject();
            });
        });
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
      />

      {open && (
        <ModalUpdate
          open={open}
          onCancel={() => setOpen(false)}
          country={countryUpdate}
        />
      )}
    </>
  );
};
export default CountryTable;
