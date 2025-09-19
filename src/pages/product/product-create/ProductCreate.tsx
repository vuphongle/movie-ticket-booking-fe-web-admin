import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
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
  Upload,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useLazyCheckSkuExistsQuery,
} from "@/app/services/products.service";
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
import { getUnitOptions } from "@/utils/productUtils";
import "../product-detail/ProductDetail.css";

const ProductCreate = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: imagesData } = useGetImagesQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();
  const [checkSkuExists] = useLazyCheckSkuExistsQuery();

  const images =
    imagesData?.map((image) => {
      return {
        id: image.id,
        url:
          image.url && image.url.startsWith("http")
            ? image.url
            : `${API_DOMAIN}${image.url || ""}`,
      };
    }) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const totalImages = images.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  const breadcrumb = [
    { label: t("PRODUCT_LIST"), href: "/admin/products" },
    { label: t("CREATE_PRODUCT"), href: "/admin/products/create" },
  ];

  // Reset form validation when language changes
  useEffect(() => {
    if (form.isFieldsTouched()) {
      // Clear all field errors first
      const fieldsErrors = form.getFieldsError();
      const fieldsWithErrors = fieldsErrors.filter(
        ({ errors }) => errors.length > 0
      );

      if (fieldsWithErrors.length > 0) {
        // Re-validate only fields that have errors to update error messages
        const fieldNames = fieldsWithErrors.map(({ name }) => name);
        form.validateFields(fieldNames).catch(() => {
          // Ignore validation errors, just trigger re-validation with new language
        });
      }
    }
  }, [t, form]);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        return createProduct(values).unwrap();
      })
      .then((data) => {
        message.success(t("CREATE_SUCCESS"));
        setTimeout(() => {
          navigate(`/admin/products/${data.id}/detail`);
        }, 1500);
      })
      .catch((error) => {
        message.error(error?.data?.message || t("CREATE_FAILED"));
      });
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const selecteImage = (image: string) => () => {
    setImageSelected(image);
  };

  const handleUploadImage = async ({ file, onSuccess, onError }: any) => {
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
      message.success(t("UPLOAD_SUCCESS"));
    } catch (error: any) {
      onError();
      message.error(error?.data?.message || t("UPLOAD_FAILED"));
    }
  };

  const beforeUpload = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }
    return true;
  };

  const handleDeleteImage = () => {
    const imageObj = images.find((image) => image.url == imageSelected);
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
        message.error(error.data.message);
      });
  };

  // Helper functions for validation rules
  const getRequiredRule = (messageKey: string) => ({
    required: true,
    message: t(messageKey),
  });

  const validateSku = async (_: any, value: string) => {
    if (!value) return Promise.resolve();

    try {
      const { data } = await checkSkuExists({ sku: value });
      if (data?.exists) {
        return Promise.reject(t("SKU_ALREADY_EXISTS"));
      }
      return Promise.resolve();
    } catch {
      return Promise.resolve(); // Allow saving if check fails
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("CREATE_PRODUCT")}</title>
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
          <RouterLink to="/admin/products">
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
            {t("CREATE_PRODUCT")}
          </Button>
        </Space>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ status: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("PRODUCT_SKU")}
                name="sku"
                rules={[
                  getRequiredRule("SKU_REQUIRED"),
                  { validator: validateSku },
                ]}
                validateDebounce={500}
              >
                <Input placeholder={t("ENTER_SKU")} />
              </Form.Item>

              <Form.Item
                label={t("PRODUCT_NAME")}
                name="name"
                rules={[getRequiredRule("PRODUCT_NAME_REQUIRED")]}
              >
                <Input placeholder={t("ENTER_PRODUCT_NAME")} />
              </Form.Item>

              <Form.Item label={t("DESCRIPTION")} name="description">
                <Input.TextArea
                  rows={4}
                  placeholder={t("ENTER_DESCRIPTION")}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={t("UNIT")} name="unit">
                <Select
                  style={{ width: "100%" }}
                  placeholder={t("SELECT_UNIT")}
                  allowClear
                  options={getUnitOptions(t)}
                />
              </Form.Item>

              <Form.Item
                label={t("QUANTITY")}
                name="quantity"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    message:
                      t("QUANTITY_MIN_ERROR") ||
                      "Số lượng phải lớn hơn hoặc bằng 0",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder={t("ENTER_QUANTITY") || "Nhập số lượng"}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label={t("THUMBNAIL")} name="thumbnail">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {thumbnail && (
                    <img
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                      src={thumbnail}
                      alt="thumbnail"
                    />
                  )}
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    {thumbnail ? t("CHANGE_THUMBNAIL") : t("SELECT_THUMBNAIL")}
                  </Button>
                </Space>
              </Form.Item>

              <Form.Item
                label={t("STATUS")}
                name="status"
                rules={[getRequiredRule("STATUS_REQUIRED")]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder={t("SELECT_STATUS")}
                  options={[
                    { label: t("ACTIVE"), value: true },
                    { label: t("INACTIVE"), value: false },
                  ]}
                />
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

export default ProductCreate;
