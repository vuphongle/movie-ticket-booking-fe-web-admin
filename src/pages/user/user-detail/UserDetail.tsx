import { LeftOutlined, RetweetOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Upload,
  message,
  theme,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "@app/services/images.service";
import {
  useGetOrdersByUserQuery,
  useGetUserByIdQuery,
  useResetPasswordMutation,
  useUpdateUserMutation,
} from "@app/services/users.service";
import AppBreadCrumb from "@components/layout/AppBreadCrumb";
import { API_DOMAIN } from "@data/constants";
import type { RootState } from "@/app/Store";
import OrderListByUser from "./OrderListByUser";

const UserDetail = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const { userId } = useParams();

  const currentUser = useSelector((state: RootState) => state.auth.auth);

  const { data: user, isLoading: isFetchingUser } = useGetUserByIdQuery(userId);
  const { data: orders, isLoading: isFetchingOrders } =
    useGetOrdersByUserQuery(userId);
  const { data: imagesData, isLoading: isFetchingImages } = useGetImagesQuery();
  const images =
    imagesData?.map((image) => {
      return {
        id: image.id,
        url: image.url.startsWith("http")
          ? image.url
          : `${API_DOMAIN}${image.url}`,
      };
    }) || [];
  const [updateUser, { isLoading: isLoadingUpdateUser }] =
    useUpdateUserMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();
  const [resetPassword, { isLoading: isLoadingResetPassword }] =
    useResetPasswordMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // số lượng hình ảnh mỗi trang
  const totalImages = images.length; // tổng số hình ảnh
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  // Xác định quyền chỉnh sửa dựa trên role
  const canEdit = useMemo(() => {
    if (!currentUser || !user) return false;

    // SUPER_ADMIN có quyền chỉnh sửa tất cả
    if (currentUser.role === "SUPER_ADMIN") return true;

    // ADMIN không được chỉnh sửa ADMIN hoặc SUPER_ADMIN
    if (currentUser.role === "ADMIN") {
      return user.role !== "ADMIN" && user.role !== "SUPER_ADMIN";
    }

    return false;
  }, [currentUser, user]);

  // Xác định có được đổi role hay không
  const canChangeRole = useMemo(() => {
    if (!currentUser || !user) return false;

    // Chỉ SUPER_ADMIN mới được đổi role
    return currentUser.role === "SUPER_ADMIN";
  }, [currentUser, user]);

  // Xác định role options có thể chọn
  const roleOptions = useMemo(() => {
    if (currentUser?.role === "SUPER_ADMIN") {
      return [
        { label: "SUPER ADMIN", value: "SUPER_ADMIN" },
        { label: "ADMIN", value: "ADMIN" },
        { label: "USER", value: "USER" },
      ];
    }
    // ADMIN chỉ thấy USER
    return [{ label: "USER", value: "USER" }];
  }, [currentUser]);

  const breadcrumb = [
    { label: "Danh sách user", href: "/admin/users" },
    { label: user?.name, href: `/admin/users/${user?.id}/detail` },
  ];

  useEffect(() => {
    if (user && avatar === null) {
      setAvatar(
        user?.avatar.startsWith("/api")
          ? `${API_DOMAIN}${user?.avatar}`
          : user?.avatar,
      );
    }
  }, [user, avatar]);

  if (isFetchingUser || isFetchingImages || isFetchingOrders) {
    return <Spin size="large" fullscreen />;
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        const { email: _email, ...updateData } = values;

        // Nếu không có quyền đổi role, bỏ role ra khỏi request
        if (!canChangeRole) {
          const { role: _role, ...dataWithoutRole } = updateData;
          return updateUser({ id: user!.id, ...dataWithoutRole }).unwrap();
        }

        return updateUser({ id: user!.id, ...updateData }).unwrap();
      })
      .then((_data) => {
        message.success("Cập nhật thông tin user thành công!");
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  const handleResetPassword = () => {
    resetPassword(user!.id)
      .unwrap()
      .then((_data) => {
        message.success("Reset mật khẩu thành công. Mật khẩu mới là: 123", 2);
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  const selecteImage = (image: string) => () => {
    setImageSelected(image);
  };

  const handleUploadImage = (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData)
      .unwrap()
      .then((_data) => {
        onSuccess?.();
        message.success("Tải ảnh lên thành công!");
      })
      .catch((error: any) => {
        onError?.(error);
        message.error(error.data.message);
      });
  };

  const handleDeleteImage = () => {
    const imageObj = images.find((image) => image.url === imageSelected);
    if (!imageObj) {
      return;
    }
    deleteImage(imageObj.id)
      .unwrap()
      .then((_data) => {
        message.success("Xóa ảnh thành công!");
        setImageSelected(null);
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>{user.name}</title>
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
        <Tabs>
          <Tabs.TabPane tab="Thông tin user" key={1}>
            <Space style={{ marginBottom: "1rem" }}>
              <RouterLink to="/admin/users">
                <Button type="default" icon={<LeftOutlined />}>
                  Quay lại
                </Button>
              </RouterLink>
              <Button
                style={{ backgroundColor: "rgb(60, 141, 188)" }}
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleUpdate}
                loading={isLoadingUpdateUser}
                disabled={!canEdit}
              >
                Cập nhật
              </Button>
              <Button
                style={{ backgroundColor: "rgb(243, 156, 18)" }}
                type="primary"
                icon={<RetweetOutlined />}
                onClick={handleResetPassword}
                loading={isLoadingResetPassword}
                disabled={!canEdit}
              >
                Reset mật khẩu
              </Button>
            </Space>

            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              initialValues={user}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Họ tên"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Họ tên không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter name" disabled={!canEdit} />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Email không được để trống!",
                      },
                      {
                        type: "email",
                        message: "Email không đúng định dạng!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter email" disabled />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại không được để trống!",
                      },
                      {
                        pattern: new RegExp(
                          /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/,
                        ),
                        message: "Số điện thoại di động không hợp lệ!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter phone" disabled={!canEdit} />
                  </Form.Item>

                  <Form.Item
                    label="Quyền"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Quyền không được để trống!",
                      },
                    ]}
                    tooltip={
                      !canChangeRole
                        ? "Bạn không có quyền thay đổi quyền của user này"
                        : undefined
                    }
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Select a role"
                      optionFilterProp="children"
                      disabled={!canChangeRole}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={roleOptions}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Trạng thái"
                    name="enabled"
                    rules={[
                      {
                        required: true,
                        message: "Trạng thái tài khoản không được để trống!",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Select a enabled"
                      optionFilterProp="children"
                      disabled={!canEdit}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { label: "Kích hoạt", value: true },
                        { label: "Chưa kích hoạt", value: false },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item name="avatar">
                    <Space direction="vertical">
                      <Avatar
                        src={<img src={avatar || ""} alt="avatar" />}
                        size={180}
                      />
                      <Button
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Thay đổi ảnh đại diện
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Modal
              title="Chọn ảnh của bạn"
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
                      Tải ảnh lên
                    </Button>
                  </Upload>

                  <Button
                    type="primary"
                    disabled={!imageSelected}
                    onClick={() => {
                      setAvatar(imageSelected);
                      setIsModalOpen(false);
                      if (imageSelected) {
                        const avatarValue = imageSelected.startsWith("http")
                          ? imageSelected
                          : imageSelected.slice(API_DOMAIN.length);
                        form.setFieldsValue({
                          avatar: avatarValue,
                        });
                      }
                    }}
                  >
                    Chọn ảnh
                  </Button>
                </Space>
                <Button
                  type="primary"
                  disabled={!imageSelected}
                  danger
                  onClick={handleDeleteImage}
                  loading={isLoadingDeleteImage}
                >
                  Xóa ảnh
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
                          } image-item border`}
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
          </Tabs.TabPane>

          <Tabs.TabPane tab="Lịch sử đặt vé" key={2}>
            <OrderListByUser data={orders || []} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default UserDetail;
