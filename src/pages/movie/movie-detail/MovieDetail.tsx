import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
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
  Tabs,
  Upload,
  message,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useGetActorsQuery } from "@/app/services/actors.service";
import { useGetCountriesQuery } from "@/app/services/countries.service";
import { useGetDirectorsQuery } from "@/app/services/directors.service";
import { useGetGenresQuery } from "@/app/services/genres.service";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "@/app/services/images.service";
import {
  useDeleteMovieMutation,
  useGetMovieByIdQuery,
  useUpdateMovieMutation,
} from "@/app/services/movies.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import { API_DOMAIN } from "@/data/constants";
import { formatDate } from "@/utils/functionUtils";
import {
  compressImage,
  validateImageFile,
  formatFileSize,
  MAX_FILE_SIZE,
} from "@/utils/imageUtils";
import ReviewList from "../review-list/ReviewList";

const MovieDetail = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { movieId } = useParams<{ movieId: string }>();
  const { data: imagesData, isLoading: isFetchingImages } = useGetImagesQuery();
  const {
    data: movie,
    isLoading: isFetchingMovie,
    refetch: refetchMovie,
  } = useGetMovieByIdQuery(movieId!);

  const { data: countries, isLoading: isLoadingCountries } =
    useGetCountriesQuery();
  const { data: genres, isLoading: isLoadingGenres } = useGetGenresQuery();
  const { data: directors, isLoading: isLoadingDirectors } =
    useGetDirectorsQuery();
  const { data: actors, isLoading: isLoadingActors } = useGetActorsQuery();

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
  const [updateMovie, { isLoading: isLoadingUpdateMovie }] =
    useUpdateMovieMutation();
  const [deleteMovie, { isLoading: isLoadingDeleteMovie }] =
    useDeleteMovieMutation();
  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] =
    useDeleteImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [poster, setPoster] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // số lượng hình ảnh mỗi trang
  const totalImages = images.length; // tổng số hình ảnh
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  const breadcrumb = [
    { label: t("MOVIE_LIST"), href: "/admin/movies" },
    { label: movie?.title, href: `/admin/movies/${movie?.id}/detail` },
  ];

  // Reset form validation when language changes
  useEffect(() => {
    if (form.isFieldsTouched()) {
      // Clear all field errors first
      const fieldsErrors = form.getFieldsError();
      const fieldsWithErrors = fieldsErrors.filter(
        ({ errors }) => errors.length > 0,
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

  useEffect(() => {
    if (movie && poster === null) {
      setPoster(
        movie?.poster && movie.poster.startsWith("/api")
          ? `${API_DOMAIN}${movie.poster}`
          : movie?.poster,
      );
    }
  }, [movie, poster]);

  if (
    isFetchingMovie ||
    isFetchingImages ||
    isLoadingCountries ||
    isLoadingGenres ||
    isLoadingDirectors ||
    isLoadingActors
  ) {
    return <Spin size="large" fullscreen />;
  }

  // Nếu đã load xong nhưng không tìm thấy movie
  if (!movie) {
    return <div>{t("MOVIE_NOT_FOUND")}</div>;
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        return updateMovie({ movieId, ...values }).unwrap();
      })
      .then((_data) => {
        message.success(t("UPDATE_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data.message);
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t("DELETE_MOVIE_CONFIRM"),
      content: t("ACTION_CANNOT_UNDONE"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      onOk: () => {
        deleteMovie(movie?.id)
          .unwrap()
          .then((_data) => {
            message.success(t("DELETE_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/movies");
            }, 1500);
          })
          .catch((error) => {
            message.error(error.data.message);
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

  const handleReviewDeleted = () => {
    // Refetch movie data to update review count
    refetchMovie();
  };

  return (
    <>
      <Helmet>
        <title>{movie.name || t("MOVIE_DETAIL")}</title>
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
          <Tabs.TabPane tab={t("MOVIE_INFO")} key={1}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: "1rem" }}
            >
              <Space>
                <RouterLink to="/admin/movies">
                  <Button type="default" icon={<LeftOutlined />}>
                    {t("BACK")}
                  </Button>
                </RouterLink>
                <Button
                  style={{ backgroundColor: "rgb(60, 141, 188)" }}
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleUpdate}
                  loading={isLoadingUpdateMovie}
                >
                  {t("UPDATE_MOVIE")}
                </Button>
              </Space>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={isLoadingDeleteMovie}
              >
                {t("DELETE_MOVIE")}
              </Button>
            </Flex>

            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              initialValues={{
                ...movie,
                genreIds: movie.genres?.map((genre: any) => genre.id),
                directorIds: movie.directors?.map(
                  (director: any) => director.id,
                ),
                actorIds: movie.actors?.map((actor: any) => actor.id),
                countryId: movie.country?.id,
                showDate: movie.showDate
                  ? dayjs(formatDate(movie.showDate), "DD/MM/YYYY")
                  : null,
              }}
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label={t("MOVIE_NAME")}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: t("MOVIE_NAME_REQUIRED"),
                      },
                    ]}
                  >
                    <Input placeholder={t("ENTER_NAME")} />
                  </Form.Item>

                  <Form.Item
                    label={t("MOVIE_NAME_EN")}
                    name="nameEn"
                    rules={[
                      {
                        required: true,
                        message: t("MOVIE_NAME_EN_REQUIRED"),
                      },
                    ]}
                  >
                    <Input placeholder={t("ENTER_ENGLISH_NAME")} />
                  </Form.Item>

                  <Form.Item
                    label={t("TRAILER")}
                    name="trailer"
                    rules={[
                      {
                        required: true,
                        message: t("TRAILER_REQUIRED"),
                      },
                    ]}
                  >
                    <Input placeholder={t("ENTER_TRAILER")} />
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
                    <Input.TextArea
                      rows={5}
                      placeholder={t("ENTER_DESCRIPTION")}
                    />
                  </Form.Item>

                  <Form.Item label={t("GENRES")} name="genreIds">
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_GENRES")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={genres?.map((genre: any) => ({
                        label: genre.name,
                        value: genre.id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label={t("DIRECTORS")} name="directorIds">
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_DIRECTORS")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={directors?.map((director: any) => ({
                        label: director.name,
                        value: director.id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label={t("ACTORS")} name="actorIds">
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_ACTORS")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={actors?.map((actor: any) => ({
                        label: actor.name,
                        value: actor.id,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t("GRAPHICS")}
                    name="graphics"
                    rules={[
                      {
                        required: true,
                        message: t("GRAPHICS_REQUIRED"),
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_GRAPHICS")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { label: "2D", value: "_2D" },
                        { label: "3D", value: "_3D" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("TRANSLATIONS")}
                    name="translations"
                    rules={[
                      {
                        required: true,
                        message: t("TRANSLATIONS_REQUIRED"),
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_TRANSLATIONS")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { label: t("SUBTITLING"), value: "SUBTITLING" },
                        { label: t("DUBBING"), value: "DUBBING" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("AGE_RATING")}
                    name="age"
                    rules={[
                      {
                        required: true,
                        message: t("AGE_RATING_REQUIRED"),
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_AGE")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { label: "P", value: "P" },
                        { label: "K", value: "K" },
                        { label: "T13", value: "T13" },
                        { label: "T16", value: "T16" },
                        { label: "T18", value: "T18" },
                        { label: "C", value: "C" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label={t("SHOW_DATE")}
                    name="showDate"
                    rules={[
                      {
                        required: true,
                        message: t("SHOW_DATE_REQUIRED"),
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                      placeholder={t("SELECT_DATE")}
                    />
                  </Form.Item>

                  <Form.Item
                    label={t("RELEASE_YEAR")}
                    name="releaseYear"
                    rules={[
                      {
                        required: true,
                        message: t("RELEASE_YEAR_REQUIRED"),
                      },
                      {
                        validator: (_, value) => {
                          if (value <= 0) {
                            return Promise.reject(t("RELEASE_YEAR_POSITIVE"));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={t("ENTER_RELEASE_YEAR")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={t("DURATION")}
                    name="duration"
                    rules={[
                      {
                        required: true,
                        message: t("DURATION_REQUIRED"),
                      },
                      {
                        validator: (_, value) => {
                          if (value <= 0) {
                            return Promise.reject(t("DURATION_POSITIVE"));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={t("ENTER_DURATION")}
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

                  <Form.Item
                    label={t("COUNTRY")}
                    name="countryId"
                    rules={[
                      {
                        required: true,
                        message: t("COUNTRY_REQUIRED"),
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder={t("SELECT_COUNTRY")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={countries?.map((country: any) => ({
                        label: country.name,
                        value: country.id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item name="poster">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <img
                        style={{
                          width: "100%",
                          height: 300,
                          objectFit: "cover",
                        }}
                        src={poster || undefined}
                        alt="poster"
                      />
                      <Button
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {t("CHANGE_POSTER")}
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
                      setPoster(imageSelected);
                      setIsModalOpen(false);
                      form.setFieldsValue({
                        poster: imageSelected?.startsWith("http")
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
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${t("MOVIE_REVIEWS")} (${movie.reviews?.length || 0})`}
            key={2}
          >
            <ReviewList
              data={movie.reviews || []}
              movieId={movieId!}
              onReviewDeleted={handleReviewDeleted}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default MovieDetail;
