import { DeleteOutlined, EditOutlined, StarOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteReviewMutation } from "@/app/services/reviews.service";
import { formatDateTime } from "../../../utils/functionUtils";
import ModalUpdate from "./ModalUpdate";
import type { Review, ReviewTableProps } from "@/types/movie.types";

const ReviewTable = ({ data, movieId }: ReviewTableProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(data);
  const [reviewUpdate, setReviewUpdate] = useState<Review | null>(null);
  const [deleteReview, { isLoading }] = useDeleteReviewMutation();

  const columns = [
    {
      title: t("FULL_NAME"),
      dataIndex: "user",
      key: "user",
      width: "15%",
      render: (user: Review["user"]) => {
        return user?.name;
      },
    },
    {
      title: t("RATING"),
      dataIndex: "rating",
      key: "rating",
      width: "10%",
      render: (rating: number) => {
        return (
          <Typography.Text>
            {rating} <StarOutlined style={{ color: "#EDBB0E" }} />
          </Typography.Text>
        );
      },
    },
    {
      title: t("CONTENT"),
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => {
        return comment;
      },
    },
    {
      title: t("TIME"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (createdAt: string) => {
        return formatDateTime(createdAt);
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      width: "10%",
      render: (_: any, record: Review) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setReviewUpdate(record);
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
        );
      },
    },
  ];

  const handleConfirm = (id: string | number) => {
    Modal.confirm({
      title: t("DELETE_REVIEW_CONFIRM"),
      content: t("ACTION_CANNOT_UNDONE"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          deleteReview(id)
            .unwrap()
            .then(() => {
              setReviews(reviews.filter((review: Review) => review.id !== id));
              message.success(t("DELETE_REVIEW_SUCCESS"));
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

  const handleUpdateReview = (review: Review) => {
    setReviews(
      reviews.map((item: Review) => {
        if (item.id === review.id) {
          return review;
        }
        return item;
      })
    );
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey={(record) => record.id}
      />

      {open && reviewUpdate && (
        <ModalUpdate
          open={open}
          onCancel={() => setOpen(false)}
          review={reviewUpdate}
          movieId={movieId}
          onUpdateReview={handleUpdateReview}
        />
      )}
    </>
  );
};
export default ReviewTable;
