import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, message, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteGenreMutation } from "@/app/services/genres.service";
import useSearchTable from "@/hooks/useSearchTable";
import ModalUpdate from "./ModalUpdate";
import type { Genre } from "@/types/movie.types";

interface GenreTableProps {
  data: Genre[];
}

const GenreTable = ({ data }: GenreTableProps) => {
  const { t } = useTranslation();
  const { getColumnSearchProps } = useSearchTable();
  const [open, setOpen] = useState(false);
  const [genreUpdate, setGenreUpdate] = useState<Genre | null>(null);
  const [deleteGenre, { isLoading }] = useDeleteGenreMutation();

  const columns: ColumnsType<Genre> = [
    {
      title: t("GENRE_NAME"),
      dataIndex: "name",
      key: "name",
      width: "70%",
      ...getColumnSearchProps("name"),
      sorter: (a: Genre, b: Genre) => a.name.localeCompare(b.name, "vi"),
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
      render: (_text, record: Genre) => {
        return (
          <Flex justify={"end"}>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setGenreUpdate(record);
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
      title: t("DELETE_GENRE_CONFIRM_TITLE"),
      content: t("DELETE_CONFIRM_CONTENT"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteGenre(id)
            .unwrap()
            .then(() => {
              message.success(t("DELETE_GENRE_SUCCESS"));
              resolve(); // Đóng modal sau khi xóa thành công
            })
            .catch((error) => {
              message.error(error.data.message);
              reject(); // Không đóng modal nếu xóa thất bại
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
          genre={genreUpdate}
        />
      )}
    </>
  );
};
export default GenreTable;
