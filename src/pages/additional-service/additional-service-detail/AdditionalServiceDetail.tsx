import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteAdditionalServiceMutation,
  useGetAdditionalServiceByIdQuery,
  useUpdateAdditionalServiceMutation,
} from "@/app/services/additionalServices.service";
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

const AdditionalServiceDetail = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { additionalServiceId } = useParams<{ additionalServiceId: string }>();

  // Skip query if additionalServiceId is undefined
  const { data: additionalService, isLoading: isFetchingAdditionalService } =
    useGetAdditionalServiceByIdQuery(additionalServiceId!, {
      skip: !additionalServiceId,
    });

  // Fix useSelector with proper typing
  const { data: imagesData, isLoading: isFetchingImages } = useGetImagesQuery();

  const images =
    imagesData?.map((image: any) => {
      return {
        id: image.id,
        url:
          image.url && image.url.startsWith("http")
            ? image.url
            : `${API_DOMAIN}${image.url || ""}`,
      };
    }) || [];
  const [
    updateAdditionalService,
    { isLoading: isLoadingUpdateAdditionalService },
  ] = useUpdateAdditionalServiceMutation();
  const [
    deleteAdditionalService,
    { isLoading: isLoadingDeleteAdditionalService },
  ] = useDeleteAdditionalServiceMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // số lượng hình ảnh mỗi trang
  const totalImages = images?.length || 0; // tổng số hình ảnh
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images?.slice(startIndex, endIndex) || [];

  const breadcrumb = [
    { label: t("ADDITIONAL_SERVICE_LIST"), href: "/admin/additional-services" },
    {
      label: additionalService?.name || t("ADDITIONAL_SERVICE_DETAIL"),
      href: `/admin/additional-services/${additionalService?.id}/detail`,
    },
  ];

  useEffect(() => {
    if (additionalService && thumbnail === null) {
      setThumbnail(
        additionalService?.thumbnail &&
          additionalService.thumbnail.startsWith("/api")
          ? `${API_DOMAIN}${additionalService.thumbnail}`
          : additionalService?.thumbnail || ""
      );
    }
  }, [additionalService, thumbnail]);

  if (isFetchingAdditionalService || isFetchingImages) {
    return <Spin size="large" fullscreen />;
  }

  if (!additionalService) {
    return <div>{t("SERVICE_NOT_FOUND")}</div>;
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdate = () => {
    if (!additionalServiceId) return;

    form
      .validateFields()
      .then((values) => {
        return updateAdditionalService({
          additionalServiceId,
          ...values,
        }).unwrap();
      })
      .then((_data) => {
        message.success(t("UPDATE_SUCCESS"));
      })
      .catch((error: any) => {
        message.error(error?.data?.message || t("UPDATE_FAILED"));
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t("DELETE_CONFIRM"),
      content: t("ACTION_CANNOT_UNDONE"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      onOk: () => {
        deleteAdditionalService(additionalService.id)
          .unwrap()
          .then((_data) => {
            message.success(t("DELETE_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/additional-services");
            }, 1500);
          })
          .catch((error: any) => {
            message.error(error?.data?.message || t("DELETE_FAILED"));
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

  const selecteImage = (image: string) => () => {
    setImageSelected(image);
  };

  const handleUploadImage = async ({ file, onSuccess, onError }: any) => {
    try {
      // Validate file first
      const validation = validateImageFile(file);
      if (!validation.valid) {
        message.error(validation.error);
        onError();
        return;
      }

      // Show original file size
      const originalSize = formatFileSize(file.size);

      // Compress image if needed
      const compressedFile = await compressImage(file, MAX_FILE_SIZE);

      // Show compression info if file was compressed
      if (compressedFile.size < file.size) {
        const newSize = formatFileSize(compressedFile.size);
        message.info(t("IMAGE_COMPRESSED", { originalSize, newSize }));
      }

      const formData = new FormData();
      formData.append("file", compressedFile);

      await uploadImage(formData).unwrap();
      onSuccess();
      message.success(t("UPLOAD_SUCCESS"));
    } catch (error: any) {
      onError();
      message.error(error?.data?.message || t("UPLOAD_FAILED"));
    }
  };

  const beforeUpload = (file: File) => {
    // Validate file type
    const validation = validateImageFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }
    return true;
  };

  const handleDeleteImage = () => {
    if (!images || !imageSelected) return;

    const imageObj = images.find((image: any) => image.url === imageSelected);
    if (!imageObj) {
      return;
    }
    deleteImage(imageObj.id)
      .unwrap()
      .then((_data) => {
        message.success(t("DELETE_IMAGE_SUCCESS"));
        setImageSelected(null);
      })
      .catch((error: any) => {
        message.error(error?.data?.message || t("DELETE_IMAGE_FAILED"));
      });
  };

  return (
    <>
      <Helmet>
        <title>
          {additionalService.name || t("ADDITIONAL_SERVICE_DETAIL")}
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
            <RouterLink to="/admin/additional-services">
              <Button type="default" icon={<LeftOutlined />}>
                {t("BACK")}
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              loading={isLoadingUpdateAdditionalService}
            >
              {t("UPDATE_ADDITIONAL_SERVICE")}
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteAdditionalService}
          >
            {t("DELETE_ADDITIONAL_SERVICE")}
          </Button>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            ...additionalService,
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={t("SERVICE_NAME")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("SERVICE_NAME_REQUIRED"),
                  },
                ]}
              >
                <Input placeholder={t("ENTER_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("DESCRIPTION")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t("DESCRIPTION_REQUIRED"),
                  },
                ]}
              >
                <Input.TextArea rows={6} placeholder={t("ENTER_DESCRIPTION")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t("PRICE")}
                name="price"
                rules={[
                  {
                    required: true,
                    message: t("PRICE_REQUIRED"),
                  },
                  {
                    validator: (_, value) => {
                      if (value <= 0) {
                        return Promise.reject(t("PRICE_POSITIVE"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("ENTER_PRICE")}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label={t("STATUS")}
                name="status"
                rules={[
                  {
                    required: true,
                    message: t("STATUS_REQUIRED"),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("SELECT_STATUS")}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: t("DRAFT"), value: false },
                    { label: t("PUBLIC"), value: true },
                  ]}
                />
              </Form.Item>

              <Form.Item name="thumbnail">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <img
                    style={{
                      width: "100%",
                      height: 300,
                      objectFit: "cover",
                      backgroundColor: "#f5f5f5",
                    }}
                    src={
                      thumbnail ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt="Thumbnail"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    {t("CHANGE_THUMBNAIL")}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title={t("CHOOSE_IMAGE")}
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
                  setThumbnail(imageSelected);
                  setIsModalOpen(false);
                  form.setFieldsValue({
                    thumbnail: imageSelected?.startsWith("http")
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
                imagesRendered.map((image: any, index: number) => (
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

export default AdditionalServiceDetail;
