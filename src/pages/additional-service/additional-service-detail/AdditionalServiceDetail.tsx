import {
  DeleteOutlined,
  LeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
  Card,
  Tag,
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
  useGetAdditionalServicePriceQuery,
  useGetAdditionalServiceItemsQuery,
  useUpdateAdditionalServiceMutation,
} from "@/app/services/additionalServices.service";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "@/app/services/images.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import ProductSelect from "@/components/ProductSelect";
import SafeImage from "@/components/SafeImage";
import useImageLoading from "@/hooks/useImageLoading";
import { API_DOMAIN } from "@/data/constants";
import {
  compressImage,
  validateImageFile,
  formatFileSize,
  MAX_FILE_SIZE,
} from "@/utils/imageUtils";

// Types for combo items
interface ComboItem {
  id?: number | string;
  productId: number | null;
  product?: any; // Use Product type from actual API response
  quantity: number;
  isEditing?: boolean;
  isNew?: boolean;
}

// Constants
const DEFAULT_QUANTITY = 1;
const MIN_COMBO_ITEMS = 2;

// Styles
const EDITING_CARD_STYLE = {
  border: "2px dashed #faad14",
  backgroundColor: "#fffbe6",
};

const WARNING_BANNER_STYLE = {
  color: "#faad14",
  backgroundColor: "#fffbe6",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "1px solid #faad14",
  fontSize: "12px",
};

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

  // Get additional service items for COMBO type
  const { data: additionalServiceItems, isLoading: isFetchingItems } =
    useGetAdditionalServiceItemsQuery(additionalServiceId!, {
      skip: !additionalServiceId || additionalService?.type !== "COMBO",
    });

  const [comboItems, setComboItems] = useState<ComboItem[]>([]);
  const [originalComboItems, setOriginalComboItems] = useState<ComboItem[]>([]);
  const [backupComboItems, setBackupComboItems] = useState<ComboItem[]>([]);
  const [currentFormType, setCurrentFormType] = useState<string>("");

  useEffect(() => {
    if (additionalServiceItems) {
      const itemsWithProductInfo = additionalServiceItems.map((item) => ({
        ...item,
        productId: item.product?.id || null,
        isEditing: false,
      }));
      setComboItems(itemsWithProductInfo);
      setOriginalComboItems(additionalServiceItems);
      setBackupComboItems(itemsWithProductInfo);
    }
  }, [additionalServiceItems]);

  useEffect(() => {
    const formType = form.getFieldValue("type");
    if (formType) {
      setCurrentFormType(formType);
    }
  }, [form]);

  const { data: pricingData, isLoading: isFetchingPricing } =
    useGetAdditionalServicePriceQuery(additionalServiceId!, {
      skip: !additionalServiceId,
    });

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

  // Use safe image loading hook
  const { imageUrl: thumbnail, setImageUrl: setThumbnail } = useImageLoading(
    additionalService?.thumbnail,
    API_DOMAIN
  );

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

  // Helper functions for combo items management
  const handleSaveComboItem = (index: number) => {
    const item = comboItems[index];
    if (!item.productId || !item.quantity) {
      message.error("Vui lòng chọn sản phẩm và nhập số lượng");
      return;
    }

    let updatedItems = [...comboItems];

    // Check for duplicates
    const existingIndex = updatedItems.findIndex(
      (existingItem, idx) =>
        idx !== index &&
        existingItem.productId === item.productId &&
        !existingItem.isEditing
    );

    if (existingIndex !== -1) {
      // Merge with existing item
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + item.quantity,
      };
      // Remove the duplicate item
      updatedItems = updatedItems.filter((_, idx) => idx !== index);
    } else {
      // Update the item
      updatedItems[index] = { ...item, isEditing: false };
    }

    // Only update state, don't save to backend yet
    setComboItems(updatedItems);
    message.success("Đã lưu item. Nhấn 'Cập nhật' để lưu thay đổi.");
  };

  const handleCancelEditComboItem = (index: number) => {
    const item = comboItems[index];
    if (item.isNew) {
      // Remove new item
      const newItems = comboItems.filter((_, idx) => idx !== index);
      setComboItems(newItems);
    } else {
      // Restore original data
      const originalItem = originalComboItems.find(
        (orig) => orig.id === item.id
      );
      if (originalItem) {
        const newItems = [...comboItems];
        newItems[index] = { ...originalItem, isEditing: false };
        setComboItems(newItems);
      }
    }
  };

  const handleRemoveComboItem = (index: number) => {
    const newItems = comboItems.filter((_, idx) => idx !== index);

    // Only update state, don't save to backend yet
    setComboItems(newItems);
    message.success("Đã xóa item. Nhấn 'Cập nhật' để lưu thay đổi.");
  };

  useEffect(() => {
    if (additionalService) {
      form.setFieldsValue({
        ...additionalService,
        type: additionalService.type || "SINGLE",
        defaultQuantity: additionalService.defaultQuantity || DEFAULT_QUANTITY,
      });
      // Set the current form type
      setCurrentFormType(additionalService.type || "SINGLE");
    }
  }, [additionalService, form]);

  if (
    isFetchingAdditionalService ||
    isFetchingImages ||
    isFetchingItems ||
    isFetchingPricing
  ) {
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
        // Additional validation for COMBO type
        if (values.type === "COMBO") {
          // Check for unsaved items (still in editing mode)
          const editingItems = (comboItems || []).filter(
            (item) => item.isEditing
          );

          if (editingItems.length > 0) {
            message.error(
              "Vui lòng lưu tất cả các items đang chỉnh sửa trước khi cập nhật"
            );
            return Promise.reject("Items still in editing mode");
          }

          const validItems = (comboItems || []).filter(
            (item) => item.productId && !item.isEditing
          );

          if (validItems.length < MIN_COMBO_ITEMS) {
            message.error("Combo phải có ít nhất 2 sản phẩm khác nhau");
            return Promise.reject("Combo validation failed");
          }

          // Check for duplicate products
          const uniqueProductIds = new Set(
            validItems.map((item) => item.productId)
          );
          if (uniqueProductIds.size !== validItems.length) {
            message.error("Không thể có sản phẩm trùng lặp trong combo");
            return Promise.reject("Duplicate products in combo");
          }

          // Add combo items to values
          values.items = validItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }));
        }

        return updateAdditionalService({
          additionalServiceId,
          ...values,
        }).unwrap();
      })
      .then((_data) => {
        message.success(t("UPDATE_SUCCESS"));
      })
      .catch((error: any) => {
        if (typeof error === "string") {
          return;
        }
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
                label={t("SERVICE_TYPE")}
                name="type"
                rules={[
                  {
                    required: true,
                    message: t("SERVICE_TYPE_REQUIRED"),
                  },
                ]}
              >
                <Select
                  placeholder={t("SELECT_SERVICE_TYPE")}
                  style={{ width: "100%" }}
                  options={[
                    { label: t("SINGLE_PRODUCT"), value: "SINGLE" },
                    { label: t("COMBO_PRODUCTS"), value: "COMBO" },
                  ]}
                  onChange={(value) => {
                    // Update current form type state
                    setCurrentFormType(value);

                    // Reset form fields when type changes
                    if (value === "SINGLE") {
                      form.setFieldsValue({
                        productId: null,
                        defaultQuantity: DEFAULT_QUANTITY,
                      });
                      // Backup current combo items before clearing
                      if (comboItems && comboItems.length > 0) {
                        setBackupComboItems([...comboItems]);
                      }
                      // Reset combo items to empty
                      setComboItems([]);
                    } else if (value === "COMBO") {
                      form.setFieldsValue({
                        productId: null,
                        defaultQuantity: null,
                      });
                      // Restore from backup if available, otherwise initialize new
                      if (backupComboItems && backupComboItems.length > 0) {
                        setComboItems([...backupComboItems]);
                      } else if (!comboItems || comboItems.length === 0) {
                        setComboItems([
                          {
                            productId: null,
                            quantity: DEFAULT_QUANTITY,
                            isNew: true,
                            isEditing: true,
                          },
                          {
                            productId: null,
                            quantity: DEFAULT_QUANTITY,
                            isNew: true,
                            isEditing: true,
                          },
                        ]);
                      }
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.type !== currentValues.type
                }
              >
                {({ getFieldValue }) => {
                  const serviceType = getFieldValue("type");
                  return serviceType === "SINGLE" ? (
                    <>
                      <Form.Item
                        label={t("PRODUCT")}
                        name="productId"
                        rules={[
                          {
                            required: true,
                            message: t("PRODUCT_REQUIRED"),
                          },
                        ]}
                      >
                        <ProductSelect placeholder={t("SELECT_PRODUCT")} />
                      </Form.Item>

                      <Form.Item
                        label={t("DEFAULT_QUANTITY")}
                        name="defaultQuantity"
                        rules={[
                          {
                            required: true,
                            message: t("DEFAULT_QUANTITY_REQUIRED"),
                          },
                          {
                            validator: (_, value) => {
                              if (value <= 0) {
                                return Promise.reject(
                                  t("DEFAULT_QUANTITY_POSITIVE")
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder={t("ENTER_DEFAULT_QUANTITY")}
                          style={{ width: "100%" }}
                          min={1}
                        />
                      </Form.Item>
                    </>
                  ) : null;
                }}
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
                  <SafeImage
                    src={thumbnail}
                    alt="Thumbnail"
                    width="100%"
                    height={300}
                    placeholderText={t("NO_IMAGE_SELECTED") || "Chưa chọn ảnh"}
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "6px",
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

        {/* COMBO Items Section */}
        {((currentFormType === "COMBO" &&
          additionalService?.type === "COMBO") ||
          currentFormType === "COMBO") && (
          <Card
            title={t("COMBO_ITEMS")}
            style={{ marginTop: 16 }}
            extra={
              <Space>
                <Tag color="blue">
                  {t("CURRENT_PRICE")}:{" "}
                  {pricingData
                    ? `${pricingData.toLocaleString()} VND`
                    : t("NOT_SET")}
                </Tag>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => {
                    const newItems = [...(comboItems || [])];
                    newItems.push({
                      productId: null,
                      quantity: DEFAULT_QUANTITY,
                      isNew: true,
                      isEditing: true,
                    });
                    setComboItems(newItems);
                  }}
                >
                  {t("ADD_PRODUCT")}
                </Button>
              </Space>
            }
          >
            {/* Warning for unsaved items */}
            {(comboItems || []).some((item) => item.isEditing) && (
              <div style={{ marginBottom: 16 }}>
                <span style={WARNING_BANNER_STYLE}>
                  ⚠️ Có{" "}
                  {(comboItems || []).filter((item) => item.isEditing).length}{" "}
                  item(s) chưa lưu. Vui lòng lưu tất cả trước khi cập nhật.
                </span>
              </div>
            )}
            {comboItems && comboItems.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                {comboItems.map((item, index) => (
                  <Card
                    key={item.id || index}
                    size="small"
                    style={{
                      marginBottom: 8,
                      ...(item.isEditing ? EDITING_CARD_STYLE : {}),
                    }}
                  >
                    <Row gutter={16} align="middle">
                      <Col span={6}>
                        <strong>
                          {t("ITEM")} {index + 1}
                        </strong>
                      </Col>
                      <Col span={6}>
                        {item.isEditing ? (
                          <ProductSelect
                            value={item.productId || item.product?.id}
                            onProductChange={(product) => {
                              const newItems = [...comboItems];
                              newItems[index] = {
                                ...item,
                                productId: product?.id || null,
                                product: product,
                              };
                              setComboItems(newItems);
                            }}
                            placeholder={t("SELECT_PRODUCT")}
                          />
                        ) : (
                          <Space>
                            <span>
                              {item.product?.name || t("PRODUCT_NOT_FOUND")}
                            </span>
                            {item.product?.sku && <Tag>{item.product.sku}</Tag>}
                          </Space>
                        )}
                      </Col>
                      <Col span={4}>
                        {item.isEditing ? (
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) => {
                              const newItems = [...comboItems];
                              newItems[index] = {
                                ...item,
                                quantity: value || DEFAULT_QUANTITY,
                              };
                              setComboItems(newItems);
                            }}
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <Space>
                            <span>{t("QUANTITY")}:</span>
                            <Tag color="green">{item.quantity}</Tag>
                          </Space>
                        )}
                      </Col>
                      <Col span={4}>
                        <Space>
                          <span>{t("UNIT")}:</span>
                          <Tag color="orange">
                            {item.product?.unit ||
                              (item.productId
                                ? t("NOT_SET")
                                : t("SELECT_PRODUCT_FIRST"))}
                          </Tag>
                        </Space>
                      </Col>
                      <Col span={4}>
                        <Space>
                          {item.isEditing ? (
                            <>
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleSaveComboItem(index)}
                                loading={isLoadingUpdateAdditionalService}
                              >
                                {t("SAVE")}
                              </Button>
                              <Button
                                size="small"
                                onClick={() => handleCancelEditComboItem(index)}
                              >
                                {t("CANCEL")}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                type="text"
                                size="small"
                                onClick={() => {
                                  const newItems = [...comboItems];
                                  newItems[index] = {
                                    ...item,
                                    isEditing: true,
                                  };
                                  setComboItems(newItems);
                                }}
                              >
                                {t("EDIT")}
                              </Button>
                              <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => handleRemoveComboItem(index)}
                                loading={isLoadingUpdateAdditionalService}
                              >
                                {t("REMOVE")}
                              </Button>
                            </>
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <span>{t("NO_COMBO_ITEMS_FOUND")}</span>
              </div>
            )}
          </Card>
        )}

        {/* Pricing Information Section */}
        {((currentFormType === "SINGLE" &&
          additionalService?.type === "SINGLE") ||
          currentFormType == "SINGLE") && (
          <Card title={t("PRICING_INFORMATION")} style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Space direction="vertical">
                  <span>
                    <strong>{t("CURRENT_PRICE")}:</strong>
                  </span>
                  <Tag
                    color="green"
                    style={{ fontSize: "16px", padding: "8px 12px" }}
                  >
                    {pricingData
                      ? `${pricingData.toLocaleString()} VND`
                      : t("NOT_SET")}
                  </Tag>
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical">
                  <span>
                    <strong>{t("DEFAULT_QUANTITY")}:</strong>
                  </span>
                  <Tag
                    color="blue"
                    style={{ fontSize: "16px", padding: "8px 12px" }}
                  >
                    {additionalService.defaultQuantity || DEFAULT_QUANTITY}
                  </Tag>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

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
                      <SafeImage
                        src={image.url}
                        alt={`image-${index}`}
                        style={{ width: "100%" }}
                        placeholderText={`Image ${index + 1}`}
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
