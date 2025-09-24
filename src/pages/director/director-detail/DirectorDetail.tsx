import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
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
  Spin,
  Upload,
  message,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FormInstance } from "antd/es/form";
import {
  useDeleteDirectorMutation,
  useGetDirectorByIdQuery,
  useUpdateDirectorMutation,
} from "@/app/services/directors.service";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "@/app/services/images.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import { API_DOMAIN } from "@/data/constants";
import { formatDate } from "@/utils/functionUtils";
import {
  compressImage,
  validateImageFile,
  formatFileSize,
  MAX_FILE_SIZE,
} from "@/utils/imageUtils";

const DirectorDetail = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const [form]: [FormInstance] = Form.useForm();
  const navigate = useNavigate();

  const { directorId } = useParams<{ directorId: string }>();
  const { data: imagesData } = useGetImagesQuery();
  const { data: director, isLoading: isFetchingDirectors } =
    useGetDirectorByIdQuery(directorId!);

  const images =
    imagesData?.map((image) => ({
      id: image.id,
      url:
        image.url && image.url.startsWith("http")
          ? image.url
          : `${API_DOMAIN}${image.url || ""}`,
    })) || [];

  const [updateDirector, { isLoading: isLoadingUpdateDirector }] =
    useUpdateDirectorMutation();
  const [deleteDirector, { isLoading: isLoadingDeleteDirector }] =
    useDeleteDirectorMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();

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
    { label: t("DIRECTOR_LIST"), href: "/admin/directors" },
    {
      label: director?.name || t("DIRECTOR_DETAIL"),
      href: `/admin/directors/${director?.id}/detail`,
    },
  ];

  useEffect(() => {
    if (director && avatar === null) {
      const avatarUrl = director.avatar;
      if (avatarUrl) {
        setAvatar(
          avatarUrl.startsWith("/api") || avatarUrl.startsWith("http")
            ? avatarUrl.startsWith("http")
              ? avatarUrl
              : `${API_DOMAIN}${avatarUrl}`
            : avatarUrl
        );
      }
    }
  }, [director, avatar]);

  if (isFetchingDirectors) {
    return <Spin size="large" />;
  }

  if (!director) {
    return <div>{t("DIRECTOR_NOT_FOUND")}</div>;
  }

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleUpdate = (): void => {
    form
      .validateFields()
      .then((values) => {
        // Transform data to match backend expectations
        const requestData = {
          name: values.name,
          description: values.description,
          birthday: values.birthday
            ? dayjs(values.birthday).format("YYYY-MM-DD")
            : "",
          avatar: values.avatar || "",
        };
        return updateDirector({
          directorId: directorId!,
          ...requestData,
        }).unwrap();
      })
      .then(() => {
        message.success(t("DIRECTOR_UPDATED_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data?.message || t("ERROR_OCCURRED"));
      });
  };

  const handleDelete = (): void => {
    Modal.confirm({
      title: t("CONFIRM_DELETE_DIRECTOR"),
      content: t("DELETE_WARNING_MESSAGE"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      onOk: () => {
        deleteDirector(director.id)
          .unwrap()
          .then(() => {
            message.success(t("DIRECTOR_DELETED_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/directors");
            }, 1500);
          })
          .catch((error) => {
            message.error(error.data?.message || t("ERROR_OCCURRED"));
          });
      },
    });
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
      message.error(t("ERROR_OCCURRED"));
      return;
    }

    deleteImage(imageObj.id)
      .unwrap()
      .then(() => {
        message.success(t("IMAGE_DELETE_SUCCESS"));
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
          {director.name} | {t("ADMIN")}
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
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: "1rem" }}
        >
          <Space>
            <RouterLink to="/admin/directors">
              <Button type="default" icon={<LeftOutlined />}>
                {t("BACK")}
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              loading={isLoadingUpdateDirector}
            >
              {t("UPDATE_DIRECTOR")}
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteDirector}
          >
            {t("DELETE_DIRECTOR")}
          </Button>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            name: director.name,
            description: director.description,
            birthday: director.birthday
              ? dayjs(formatDate(director.birthday), "DD/MM/YYYY")
              : null,
            avatar: director.avatar,
          }}
        >
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
                      if (!value) {
                        return Promise.resolve();
                      }

                      if (dayjs(value).isAfter(dayjs(), "day")) {
                        return Promise.reject(
                          new Error(t("BIRTH_DATE_FUTURE_ERROR"))
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
                label={t("DESCRIPTION")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("DESCRIPTION_REQUIRED"),
                  },
                  {
                    min: 10,
                    message: t("DESCRIPTION_MIN_LENGTH"),
                  },
                  {
                    max: 500,
                    message: t("DESCRIPTION_MAX_LENGTH"),
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder={t("ENTER_DESCRIPTION")}
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
                  <Button
                    type="primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: "rgb(22, 119, 255)" }}
                  >
                    {t("CHANGE_DIRECTOR_IMAGE")}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title={t("SELECT_IMAGE")}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "16px",
              marginTop: "16px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {imagesRendered.map((image) => (
              <div
                key={image.id}
                style={{
                  cursor: "pointer",
                  border:
                    imageSelected === image.url
                      ? "3px solid #1890ff"
                      : "1px solid #d9d9d9",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                onClick={selecteImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={`Image ${image.id}`}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalImages}
            onChange={onPageChange}
            showSizeChanger={false}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        </Modal>
      </div>
    </>
  );
};

export default DirectorDetail;
