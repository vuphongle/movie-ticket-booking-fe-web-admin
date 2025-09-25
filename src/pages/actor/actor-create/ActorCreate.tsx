import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Upload,
  message,
  theme,
} from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { FormInstance } from "antd/es/form";
import { useCreateActorMutation } from "@/app/services/actors.service";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "@/app/services/images.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import { API_DOMAIN } from "@/data/constants";
import {
  compressImage,
  validateImageFile,
  formatFileSize,
  MAX_FILE_SIZE,
} from "@/utils/imageUtils";

const ActorCreate = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const [createActor, { isLoading }] = useCreateActorMutation();
  const [form]: [FormInstance] = Form.useForm();
  const navigate = useNavigate();

  const { data: imagesData } = useGetImagesQuery();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();

  const images =
    imagesData?.map((image) => ({
      id: image.id,
      url:
        image.url && image.url.startsWith("http")
          ? image.url
          : `${API_DOMAIN}${image.url || ""}`,
    })) || [];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;
  const totalImages = images.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  const breadcrumb = [
    { label: t("ACTOR_LIST"), href: "/admin/actors" },
    { label: t("CREATE_ACTOR"), href: "/admin/actors/create" },
  ];

  const handleCreate = (): void => {
    form
      .validateFields()
      .then((values) => {
        return createActor(values).unwrap();
      })
      .then((data) => {
        message.success(t("ACTOR_CREATED_SUCCESS"));
        setTimeout(() => {
          navigate(`/admin/actors/${data.id}/detail`);
        }, 1500);
      })
      .catch((error) => {
        message.error(error.data?.message || t("ERROR_OCCURRED"));
      });
  };

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const selecteImage = (image: string) => (): void => {
    setImageSelected(image);
  };

  const handleUploadImage = async ({
    file,
    onSuccess,
    onError,
  }: any): Promise<void> => {
    try {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        message.error(validation.error);
        onError();
        return;
      }

      const originalSize = formatFileSize(file.size);
      const compressedFile = await compressImage(file, MAX_FILE_SIZE);

      if (compressedFile.size < file.size) {
        const newSize = formatFileSize(compressedFile.size);
        message.info(t("IMAGE_COMPRESSED", { originalSize, newSize }));
      }

      const formData = new FormData();
      formData.append("file", compressedFile);

      await uploadImage(formData).unwrap();
      onSuccess();
      message.success(t("IMAGE_UPLOAD_SUCCESS"));
    } catch (error: any) {
      onError();
      message.error(error?.data?.message || t("ERROR_OCCURRED"));
    }
  };

  const beforeUpload = (file: File): boolean => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }
    return true;
  };

  const handleDeleteImage = (): void => {
    if (!imageSelected || !images) return;

    const imageObj = images.find((image) => image.url === imageSelected);
    if (!imageObj) {
      return;
    }
    deleteImage(imageObj.id)
      .unwrap()
      .then((_data) => {
        message.success(t("DELETE_IMAGE_SUCCESS"));
        setImageSelected(null);
      })
      .catch((error) => {
        message.error(error?.data?.message || t("ERROR_OCCURRED"));
      });
  };

  return (
    <>
      <Helmet>
        <title>
          {t("CREATE_ACTOR")} | {t("ADMIN")}
        </title>
      </Helmet>
      <AppBreadCrumb items={breadcrumb} />

      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Space style={{ marginBottom: "1rem" }}>
          <RouterLink to="/admin/actors">
            <Button type="default" icon={<LeftOutlined />}>
              {t("BACK")}
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={isLoading}
          >
            {t("CREATE_ACTOR")}
          </Button>
        </Space>

        <Form form={form} layout="vertical" autoComplete="off">
          <Row>
            <Col span={12}>
              <Form.Item
                label={t("NAME")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("NAME_REQUIRED"),
                  },
                  {
                    max: 50,
                    message: t("NAME_MAX_LENGTH"),
                  },
                ]}
              >
                <Input placeholder={t("ENTER_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("BIRTH_DATE")}
                name="birthday"
                rules={[
                  {
                    required: true,
                    message: t("BIRTH_DATE_REQUIRED"),
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      if (dayjs(value).isAfter(dayjs(), "day")) {
                        return Promise.reject(
                          new Error(t("BIRTH_DATE_FUTURE_ERROR")),
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf("day");
                  }}
                />
              </Form.Item>

              <Form.Item
                label={t("BIO")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("BIO_REQUIRED"),
                  },
                  {
                    min: 10,
                    message: t("BIO_MIN_LENGTH"),
                  },
                  {
                    max: 500,
                    message: t("BIO_MAX_LENGTH"),
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder={t("ENTER_BIO")}
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item label={t("AVATAR")} name="avatar">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {avatar && (
                    <Avatar
                      src={<img src={avatar} alt="avatar" />}
                      size={180}
                    />
                  )}
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    {avatar ? t("CHANGE_ACTOR_IMAGE") : t("SELECT_YOUR_IMAGE")}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title={t("SELECT_YOUR_IMAGE")}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setImageSelected(null);
          }}
          footer={null}
          width={1200}
          style={{ top: 20 }}
        >
          <Flex justify="space-between" align="center">
            <Space direction="horizontal">
              <Upload
                maxCount={1}
                accept="image/*"
                beforeUpload={beforeUpload}
                customRequest={handleUploadImage}
                showUploadList={false}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "rgb(243, 156, 18)",
                  }}
                  loading={isLoadingUploadImage}
                >
                  {t("UPLOAD_IMAGE")}
                </Button>
              </Upload>

              <Button
                type="primary"
                disabled={!imageSelected}
                onClick={() => {
                  setAvatar(imageSelected);
                  setIsModalOpen(false);
                  form.setFieldsValue({
                    avatar: imageSelected?.startsWith("http")
                      ? imageSelected
                      : imageSelected?.slice(API_DOMAIN.length),
                  });
                }}
              >
                {t("SELECT_IMAGE")}
              </Button>
            </Space>
            <Button
              type="primary"
              disabled={!imageSelected}
              danger
              onClick={handleDeleteImage}
              loading={isLoadingDeleteImage}
            >
              {t("DELETE_IMAGE")}
            </Button>
          </Flex>

          <div style={{ marginTop: "1rem" }} id="image-container">
            <Row gutter={[16, 16]} wrap={true}>
              {imagesRendered &&
                imagesRendered.map((image, index) => (
                  <Col span={6} key={index}>
                    <div
                      className={`${
                        imageSelected === image.url ? "image-selected" : ""
                      } image-item`}
                      onClick={selecteImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={`image-${index}`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Col>
                ))}
            </Row>
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalImages}
            onChange={onPageChange}
            showSizeChanger={false}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </Modal>
      </div>
    </>
  );
};

export default ActorCreate;
