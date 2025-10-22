import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
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
  Upload,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/app/services/blogs.service";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "@app/services/images.service";
import AppBreadCrumb from "@components/layout/AppBreadCrumb";
import { API_DOMAIN } from "@data/constants";

interface ImageData {
  id: string | number;
  url: string;
}

const BlogDetail = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { blogId } = useParams();
  const { data: imagesData } = useGetImagesQuery();
  const { data: blog, isLoading: isFetchingBlog } = useGetBlogByIdQuery(blogId);

  const images: ImageData[] =
    imagesData?.map((image) => ({
      id: image.id,
      url:
        image.url && image.url.startsWith("http")
          ? image.url
          : `${API_DOMAIN}${image.url || ""}`,
    })) || [];

  const [updateBlog, { isLoading: isLoadingUpdateBlog }] =
    useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isLoadingDeleteBlog }] =
    useDeleteBlogMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();

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
    { label: "Danh sách bài viết", href: "/admin/blogs" },
    { label: blog?.title, href: `/admin/blogs/${blog?.id}/detail` },
  ];

  useEffect(() => {
    if (blog && thumbnail === null && blog.thumbnail) {
      const thumbnailUrl =
        blog.thumbnail.startsWith("/api") || blog.thumbnail.startsWith("http")
          ? blog.thumbnail.startsWith("http")
            ? blog.thumbnail
            : `${API_DOMAIN}${blog.thumbnail}`
          : blog.thumbnail;
      setThumbnail(thumbnailUrl);
    }
  }, [blog, thumbnail]);

  if (isFetchingBlog) {
    return <Spin size="large" fullscreen />;
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        return updateBlog({ blogId, ...values }).unwrap();
      })
      .then(() => {
        message.success("Cập nhật bài viết thành công!");
      })
      .catch((error: any) => {
        message.error(error.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleDelete = () => {
    if (!blog) return;

    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa bài viết này?",
      content: "Hành động này không thể hoàn tác!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteBlog(blog.id)
          .unwrap()
          .then(() => {
            message.success("Xóa bài viết thành công!");
            setTimeout(() => {
              navigate("/admin/blogs");
            }, 1500);
          })
          .catch((error: any) => {
            message.error(error.data?.message || "Có lỗi xảy ra");
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

  const handleUploadImage = (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData)
      .unwrap()
      .then(() => {
        if (onSuccess) onSuccess(null);
        message.success("Tải ảnh lên thành công!");
      })
      .catch((error: any) => {
        if (onError) onError(error);
        message.error(error.data?.message || "Có lỗi xảy ra");
      });
  };

  const handleDeleteImage = () => {
    const imageObj = images.find((image) => image.url === imageSelected);
    if (!imageObj) {
      return;
    }
    deleteImage(imageObj.id)
      .unwrap()
      .then(() => {
        message.success("Xóa ảnh thành công!");
        setImageSelected(null);
      })
      .catch((error: any) => {
        message.error(error.data?.message || "Có lỗi xảy ra");
      });
  };

  return (
    <>
      <Helmet>
        <title>{blog?.title || "Chi tiết bài viết"}</title>
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
            <RouterLink to="/admin/blogs">
              <Button type="default" icon={<LeftOutlined />}>
                Quay lại
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleUpdate}
              loading={isLoadingUpdateBlog}
            >
              Cập nhật
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeleteBlog}
          >
            Xóa bài viết
          </Button>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            ...blog,
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Tiêu đề không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Nội dung không được để trống!",
                  },
                ]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={blog?.content || ""}
                  onChange={(_event, editor) => {
                    const data = editor.getData();
                    form.setFieldsValue({ content: data });
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Mô tả không được để trống!",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Trạng thái không được để trống!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a status"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: "Nháp", value: false },
                    { label: "Công khai", value: true },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Danh mục không được để trống!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: "Phim chiếu rạp", value: "PHIM_CHIEU_RAP" },
                    { label: "Tổng hợp phim", value: "TONG_HOP_PHIM" },
                    { label: "Phim Netflix", value: "PHIM_NEFLIX" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="thumbnail">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {thumbnail && (
                    <img
                      style={{
                        width: "100%",
                        height: 300,
                        objectFit: "cover",
                      }}
                      src={thumbnail}
                      alt="Thumbnail"
                    />
                  )}
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Thay đổi ảnh bài viết
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
                  if (imageSelected) {
                    setThumbnail(imageSelected);
                    setIsModalOpen(false);
                    form.setFieldsValue({
                      thumbnail: imageSelected.startsWith("http")
                        ? imageSelected
                        : imageSelected.slice(API_DOMAIN.length),
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

export default BlogDetail;
