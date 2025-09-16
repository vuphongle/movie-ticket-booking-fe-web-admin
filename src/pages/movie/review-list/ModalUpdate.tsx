import { Button, Form, Input, InputNumber, Modal, Space, message } from "antd";
import { useTranslation } from "react-i18next";
import { useUpdateReviewMutation } from "@/app/services/reviews.service";
import type { MovieReviewModalUpdateProps } from "@/types/movie.types";

const ModalUpdate = (props: MovieReviewModalUpdateProps) => {
  const { t } = useTranslation();
  const { review, open, onCancel, onUpdateReview } = props;
  const [updateReview, { isLoading }] = useUpdateReviewMutation();

  const onFinish = (values: { rating: number; comment: string }) => {
    updateReview({ reviewId: review.id, ...values })
      .unwrap()
      .then((data) => {
        onUpdateReview(data);
        message.success(t("UPDATE_REVIEW_SUCCESS"));
        onCancel();
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Modal
        open={open}
        title={t("UPDATE_REVIEW_MODAL_TITLE")}
        footer={null}
        onCancel={onCancel}
        confirmLoading={isLoading}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...review }}
        >
          <Form.Item
            name="rating"
            rules={[
              {
                required: true,
                message: t("RATING_REQUIRED"),
              },
              {
                validator: (_, value) => {
                  if (value <= 0 || value > 10) {
                    return Promise.reject(t("RATING_RANGE_ERROR"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder={t("ENTER_RATING")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: t("REVIEW_CONTENT_REQUIRED"),
              },
            ]}
          >
            <Input.TextArea rows={5} placeholder={t("ENTER_REVIEW_CONTENT")} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("UPDATE")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpdate;
