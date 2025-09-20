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
  Card,
  Descriptions,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useLazyCheckSkuExistsQuery,
  useLazyCheckCanDeactivateProductQuery,
} from "@/app/services/products.service";
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
import { getUnitOptions } from "@/utils/productUtils";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { productId } = useParams<{ productId: string }>();
  const { data: imagesData, isLoading: isFetchingImages } = useGetImagesQuery();
  const { data: product, isLoading: isFetchingProduct } =
    useGetProductByIdQuery(productId!);

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

  const [updateProduct, { isLoading: isLoadingUpdateProduct }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: isLoadingDeleteProduct }] =
    useDeleteProductMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();
  const [checkCanDeactivate] = useLazyCheckCanDeactivateProductQuery();
  const [checkSkuExists] = useLazyCheckSkuExistsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // số lượng hình ảnh mỗi trang
  const totalImages = images.length; // tổng số hình ảnh
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  const breadcrumb = [
    { label: t("PRODUCT_LIST"), href: "/admin/products" },
    {
      label: product?.name || t("PRODUCT_DETAIL"),
      href: `/admin/products/${product?.id}/detail`,
    },
  ];

  // Reset form validation when language changes
  useEffect(() => {
    if (form.isFieldsTouched()) {
      const fieldsErrors = form.getFieldsError();
      const fieldsWithErrors = fieldsErrors.filter(
        ({ errors }) => errors.length > 0
      );

      if (fieldsWithErrors.length > 0) {
        const fieldNames = fieldsWithErrors.map(({ name }) => name);
        form.validateFields(fieldNames).catch(() => {
          // Ignore validation errors, just trigger re-validation with new language
        });
      }
    }
  }, [t, form]);

  useEffect(() => {
    if (product && thumbnail === null) {
      setThumbnail(
        product?.thumbnail && product.thumbnail.startsWith("/api")
          ? `${API_DOMAIN}${product.thumbnail}`
          : product?.thumbnail || null
      );
    }
  }, [product, thumbnail]);

  if (isFetchingProduct || isFetchingImages) {
    return <Spin size="large" fullscreen />;
  }

  // Nếu đã load xong nhưng không tìm thấy product
  if (!product) {
    return <div>{t("PRODUCT_NOT_FOUND")}</div>;
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
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

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      // Kiểm tra nếu đang thay đổi status từ true sang false
      if (product.status && !values.status) {
        const result = await checkCanDeactivate(Number(product.id)).unwrap();
        if (!result.canDeactivate) {
          Modal.confirm({
            title: t("CANNOT_DEACTIVATE_PRODUCT"),
            content: t("PRODUCT_IN_USE_MESSAGE"),
            okText: t("OK"),
            cancelText: t("CANCEL"),
            onOk: () => {
              // User acknowledges, do nothing
            },
          });
          return;
        }
      }

      await updateProduct({ productId: product.id, ...values }).unwrap();
      message.success(t("UPDATE_SUCCESS"));
    } catch (error: any) {
      message.error(error?.data?.message || t("UPDATE_FAILED"));
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t("DELETE_PRODUCT_CONFIRM"),
      content: t("ACTION_CANNOT_UNDONE"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      onOk: () => {
        deleteProduct(product.id)
          .unwrap()
          .then(() => {
            message.success(t("DELETE_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/products");
            }, 1500);
          })
          .catch((error) => {
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

  const validateSku = async (_: any, value: string) => {
    if (!value) return Promise.resolve();
    if (value === product.sku) return Promise.resolve(); // Same as current SKU

    try {
      const { data } = await checkSkuExists({
        sku: value,
        excludeId: product.id,
      });
      if (data?.exists) {
        return Promise.reject(t("SKU_ALREADY_EXISTS"));
      }
      return Promise.resolve();
    } catch {
      return Promise.resolve(); // Allow saving if check fails
    }
  };

  // Helper functions for validation rules
  const getRequiredRule = (messageKey: string) => ({
    required: true,
    message: t(messageKey),
  });

  return (
    <>
      <Helmet>
        <title>{product.name || t("PRODUCT_DETAIL")}</title>
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
            <RouterLink to="/admin/products">
              <Button type="default" icon={<LeftOutlined />}>
                {t("BACK")}
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              loading={isLoadingUpdateProduct}
            >
              {t("UPDATE_PRODUCT")}
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteProduct}
          >
            {t("DELETE_PRODUCT")}
          </Button>
        </Flex>

        <Row gutter={[16, 16]}>
          {/* Product Information Card */}
          <Col span={24}>
            <Card title={t("PRODUCT_INFORMATION")} style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label={t("PRODUCT_SKU")}>
                  <strong>{product.sku}</strong>
                </Descriptions.Item>
                <Descriptions.Item label={t("STATUS")}>
                  <Tag color={product.status ? "success" : "warning"}>
                    {product.status ? t("ACTIVE") : t("INACTIVE")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("PRODUCT_NAME")}>
                  {product.name}
                </Descriptions.Item>
                <Descriptions.Item label={t("UNIT")}>
                  {product.unit || "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("QUANTITY")}>
                  {product.quantity !== undefined ? product.quantity : "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("CREATED_AT")}>
                  {product.createdAt ? formatDate(product.createdAt) : "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("UPDATED_AT")}>
                  {product.updatedAt ? formatDate(product.updatedAt) : "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("DESCRIPTION")} span={2}>
                  {product.description || "-"}
                </Descriptions.Item>
                {thumbnail && (
                  <Descriptions.Item label={t("THUMBNAIL")} span={2}>
                    <img
                      src={thumbnail}
                      alt={product.name}
                      style={{
                        maxWidth: 200,
                        maxHeight: 200,
                        objectFit: "cover",
                      }}
                    />
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>

          {/* Edit Form */}
          <Col span={24}>
            <Card title={t("EDIT_PRODUCT")}>
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                initialValues={{
                  sku: product.sku,
                  name: product.name,
                  description: product.description,
                  unit: product.unit,
                  thumbnail: product.thumbnail,
                  status: product.status,
                  quantity: product.quantity || 0,
                }}
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
                          message: t("QUANTITY_MIN_ERROR"),
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={t("ENTER_QUANTITY")}
                        min={0}
                        precision={0}
                      />
                    </Form.Item>

                    <Form.Item label={t("THUMBNAIL")} name="thumbnail">
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <img
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                          src={thumbnail || undefined}
                          alt="thumbnail"
                        />
                        <Button
                          type="primary"
                          onClick={() => setIsModalOpen(true)}
                        >
                          {t("CHANGE_THUMBNAIL")}
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
            </Card>
          </Col>
        </Row>

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

export default ProductDetail;
