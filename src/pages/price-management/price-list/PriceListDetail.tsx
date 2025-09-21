import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  theme,
  DatePicker,
  InputNumber,
} from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  useDeletePriceListMutation,
  useGetPriceListByIdQuery,
  useUpdatePriceListMutation,
} from "@/app/services/priceList.service";
import AppBreadCrumb from "@/components/layout/AppBreadCrumb";
import PriceItemSection from "../price-item/PriceItemSection";

const { RangePicker } = DatePicker;

const PriceListDetail = () => {
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { priceListId } = useParams<{ priceListId: string }>();
  const { data: priceList, isLoading: isFetchingPriceList } =
    useGetPriceListByIdQuery(parseInt(priceListId!));

  const [updatePriceList, { isLoading: isLoadingUpdatePriceList }] =
    useUpdatePriceListMutation();
  const [deletePriceList, { isLoading: isLoadingDeletePriceList }] =
    useDeletePriceListMutation();

  // Force re-render when language changes
  useEffect(() => {
    if (priceList && !isFetchingPriceList) {
      try {
        const validityPeriod = [];
        if (priceList.validFrom) {
          validityPeriod.push(dayjs(priceList.validFrom));
        }
        if (priceList.validTo) {
          validityPeriod.push(dayjs(priceList.validTo));
        }

        form.setFieldsValue({
          name: priceList.name || "",
          priority: priceList.priority || 1,
          status: Boolean(priceList.status),
          validityPeriod: validityPeriod.length === 2 ? validityPeriod : null,
        });
      } catch {
        // Handle date parsing errors gracefully
        form.setFieldsValue({
          name: priceList.name || "",
          priority: priceList.priority || 1,
          status: Boolean(priceList.status),
          validityPeriod: null,
        });
      }
    }
  }, [priceList, isFetchingPriceList, form]);

  const breadcrumb = [
    {
      label: t("PRICE_LIST_MANAGEMENT"),
      href: "/admin/price-lists",
    },
    {
      label: priceList?.name || t("PRICE_LIST_DETAIL"),
      href: `/admin/price-lists/${priceList?.id}/detail`,
    },
  ];

  if (isFetchingPriceList) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }

  const handleUpdate = (values: any) => {
    const payload: any = {
      name: values.name,
      priority: values.priority,
      status: values.status ?? true,
    };

    // Handle validity dates
    if (values.validityPeriod && values.validityPeriod.length === 2) {
      // Set start date to 00:00:00
      const validFrom = values.validityPeriod[0].clone();
      validFrom.hour(0).minute(0).second(0).millisecond(0);

      // Set end date to 23:59:59
      const validTo = values.validityPeriod[1].clone();
      validTo.hour(23).minute(59).second(59).millisecond(999);

      payload.validFrom = validFrom.toISOString();
      payload.validTo = validTo.toISOString();
    } else {
      payload.validFrom = null;
      payload.validTo = null;
    }

    updatePriceList({
      id: parseInt(priceListId!),
      ...payload,
    })
      .unwrap()
      .then(() => {
        message.success(t("UPDATE_SUCCESS"));
      })
      .catch((error) => {
        message.error(error.data?.message || t("UPDATE_ERROR"));
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t("DELETE_CONFIRM_TITLE"),
      content: t("DELETE_CONFIRM_CONTENT"),
      okText: t("DELETE"),
      okType: "danger",
      cancelText: t("CANCEL"),
      onOk: () => {
        deletePriceList(parseInt(priceListId!))
          .unwrap()
          .then((_data) => {
            message.success(t("DELETE_SUCCESS"));
            setTimeout(() => {
              navigate("/admin/price-management/price-lists");
            }, 1500);
          })
          .catch((error) => {
            message.error(error.data?.message || t("DELETE_ERROR"));
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

  return (
    <>
      <Helmet>
        <title>{priceList?.name || t("PRICE_LIST_DETAIL")}</title>
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
            <RouterLink to="/admin/price-management/price-lists">
              <Button type="default" icon={<LeftOutlined />}>
                {t("BACK")}
              </Button>
            </RouterLink>
            <Button
              style={{ backgroundColor: "rgb(60, 141, 188)" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={isLoadingUpdatePriceList}
            >
              {t("UPDATE_PRICE_LIST")}
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={isLoadingDeletePriceList}
          >
            {t("DELETE_PRICE_LIST")}
          </Button>
        </Flex>

        <Form
          key={i18n.language}
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleUpdate}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("PRICE_LIST_NAME")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("PRICE_LIST_NAME_REQUIRED"),
                  },
                  {
                    min: 3,
                    message: t("PRICE_LIST_NAME_MIN_LENGTH"),
                  },
                ]}
              >
                <Input placeholder={t("ENTER_PRICE_LIST_NAME")} />
              </Form.Item>

              <Form.Item
                label={t("PRIORITY")}
                name="priority"
                rules={[
                  {
                    required: true,
                    message: t("PRIORITY_REQUIRED"),
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 999,
                    message: t("PRIORITY_RANGE"),
                  },
                ]}
                tooltip={t("PRIORITY_TOOLTIP")}
              >
                <InputNumber
                  placeholder={t("ENTER_PRIORITY")}
                  style={{ width: "100%" }}
                  min={1}
                  max={999}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("VALIDITY_PERIOD")}
                name="validityPeriod"
                tooltip={t("VALIDITY_PERIOD_TOOLTIP")}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  placeholder={[t("VALID_FROM"), t("VALID_TO")]}
                  format="DD/MM/YYYY"
                />
              </Form.Item>

              <Form.Item
                label={t("STATUS")}
                name="status"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={t("ACTIVE")}
                  unCheckedChildren={t("INACTIVE")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {priceList && <PriceItemSection priceList={priceList} />}
    </>
  );
};

export default PriceListDetail;
