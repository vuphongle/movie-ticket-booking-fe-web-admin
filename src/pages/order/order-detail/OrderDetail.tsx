import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Spin,
  Tag,
  theme,
  Typography,
  Modal,
  message,
  Input,
} from "antd";
import { Helmet } from "react-helmet";
import { Link, Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetOrderByIdQuery,
  useReturnOrderMutation,
} from "@services/orders.service";
import ErrorPage from "@/components/errors/ErrorPage";
import AppBreadCrumb from "@components/layout/AppBreadCrumb";
import {
  formatCurrency,
  formatDate,
  convertDateArrayToDate,
} from "@utils/functionUtils";
import ServiceTable from "../order-list/ServiceTable";
import TicketTable from "../order-list/TicketTable";
import type { OrderStatus } from "@/types/order.types";

const OrderDetail = () => {
  const { t } = useTranslation();

  const parseOrderStatus = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Tag color="default">{t("ORDER_STATUS_PENDING")}</Tag>;
      case "CONFIRMED":
        return <Tag color="success">{t("ORDER_STATUS_CONFIRMED")}</Tag>;
      case "CANCELLED":
        return <Tag color="error">{t("ORDER_STATUS_CANCELLED")}</Tag>;
      case "RETURNED":
        return <Tag color="purple">{t("ORDER_STATUS_RETURNED")}</Tag>;
      default:
        return <Tag color="default">{t("ORDER_STATUS_UNKNOWN")}</Tag>;
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { orderId } = useParams();
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(Number(orderId));

  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();

  // Kiểm tra xem có thể trả hàng không
  const canReturn = () => {
    if (!order) return false;
    if (order.status !== "CONFIRMED") return false;

    // Kiểm tra suất chiếu chưa qua
    const showtimeDate = convertDateArrayToDate(order.showtime.date);
    const [hours, minutes] = order.showtime.startTime.split(":");
    const showtimeDateTime = new Date(showtimeDate);
    showtimeDateTime.setHours(parseInt(hours), parseInt(minutes));

    return showtimeDateTime > new Date();
  };

  const handleReturn = async () => {
    let reason = "";

    Modal.confirm({
      title: t("ORDER_RETURN_CONFIRM"),
      width: 520,
      centered: true,
      content: (
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
            {t("ORDER_RETURN_REASON")}{" "}
            <Typography.Text type="danger">*</Typography.Text>
          </Typography.Text>
          <Input.TextArea
            rows={4}
            onChange={(e) => {
              reason = e.target.value;
            }}
            placeholder={t("ORDER_RETURN_REASON_PLACEHOLDER")}
            style={{ resize: "none", marginBottom: 4 }}
            maxLength={500}
            showCount
          />
        </div>
      ),
      okText: t("ORDER_RETURN_CONFIRM_BTN"),
      okType: "danger",
      cancelText: t("ORDER_RETURN_CANCEL_BTN"),
      onOk: async () => {
        if (!reason || reason.trim() === "") {
          message.error(t("ORDER_RETURN_REASON_REQUIRED"));
          return Promise.reject();
        }
        try {
          await returnOrder({
            orderId: Number(orderId),
            reason: reason,
          }).unwrap();
          message.success(t("ORDER_RETURN_SUCCESS"));
        } catch (err: any) {
          message.error(err?.data?.error || t("ORDER_RETURN_FAILED"));
          return Promise.reject();
        }
      },
    });
  };

  const breadcrumb = [
    { label: t("ORDER_LIST"), href: "/admin/orders" },
    {
      label: `${t("ORDER_DETAIL")} ${order?.id}`,
      href: `/admin/orders/${order?.id}/detail`,
    },
  ];

  if (isLoading) {
    return <Spin size="large" fullscreen />;
  }

  if (isError || !order) {
    return <ErrorPage error={error as any} />;
  }

  return (
    <>
      <Helmet>
        <title>{`${t("ORDER_DETAIL")} ${order?.id}`}</title>
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
            <RouterLink to="/admin/orders">
              <Button type="default" icon={<LeftOutlined />}>
                {t("ORDER_BACK")}
              </Button>
            </RouterLink>
            {canReturn() && (
              <Button
                type="primary"
                danger
                onClick={handleReturn}
                loading={isReturning}
              >
                {t("ORDER_RETURN")}
              </Button>
            )}
          </Space>
        </Flex>

        <Row gutter={16}>
          <Col span={6}>
            <Typography.Title level={5}>{t("ORDER_INFO")}</Typography.Title>
            <Divider />
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_CODE")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>{order?.id}</Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_MOVIE")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Link to={`/admin/movies/${order?.showtime.movie.id}/detail`}>
                    {order?.showtime.movie.name}
                  </Link>
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_SHOWTIME_TIME")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Tag color="volcano">
                    {order?.showtime.startTime} - {order?.showtime.endTime}
                  </Tag>
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_SHOWTIME_DATE")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {formatDate(order.showtime.date)}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_AUDITORIUM")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {order.showtime.auditorium.name}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_CINEMA")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Link
                    to={`/admin/cinemas/${order.showtime.auditorium.cinema.id}/detail`}
                  >
                    {order.showtime.auditorium.cinema.name}
                  </Link>
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_CREATED_DATE")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {formatDate(order.createdAt)}
                </Typography.Paragraph>
              </Col>
            </Row>
            {order.returnedByUser && (
              <>
                <Divider />
                <Typography.Title level={5} type="danger">
                  {t("ORDER_RETURN_INFO")}
                </Typography.Title>
                <Row>
                  <Col span={7}>
                    <Typography.Paragraph strong>
                      {t("ORDER_RETURN_HANDLER")}:
                    </Typography.Paragraph>
                  </Col>
                  <Col span={17}>
                    <Typography.Paragraph>
                      {order.returnedByUser.name}
                    </Typography.Paragraph>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <Typography.Paragraph strong>
                      {t("ORDER_EMAIL")}:
                    </Typography.Paragraph>
                  </Col>
                  <Col span={17}>
                    <Typography.Paragraph>
                      {order.returnedByUser.email}
                    </Typography.Paragraph>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <Typography.Paragraph strong>
                      {t("ORDER_RETURN_TIME")}:
                    </Typography.Paragraph>
                  </Col>
                  <Col span={17}>
                    <Typography.Paragraph>
                      <Tag color="purple">
                        {order.returnedAt
                          ? formatDate(order.returnedAt)
                          : "N/A"}
                      </Tag>
                    </Typography.Paragraph>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <Typography.Paragraph strong>
                      {t("ORDER_RETURN_REASON_LABEL")}:
                    </Typography.Paragraph>
                  </Col>
                  <Col span={17}>
                    <Typography.Paragraph>
                      {order.returnedReason ? order.returnedReason : "N/A"}
                    </Typography.Paragraph>
                  </Col>
                </Row>
              </>
            )}
          </Col>
          <Col span={6}>
            <Typography.Title level={5}>
              {t("ORDER_CUSTOMER_INFO")}
            </Typography.Title>
            <Divider />
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_CUSTOMER")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Link to={`/admin/users/${order?.user.id}/detail`}>
                    {order?.user.name}
                  </Link>
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_PHONE")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>{order?.user.phone}</Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_EMAIL")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>{order?.user.email}</Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_STATUS")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {parseOrderStatus(order.status)}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_SUBTOTAL")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Tag color="blue">{formatCurrency(order.tempPrice || 0)}</Tag>
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_DISCOUNT")}{" "}
                  {order.discount ? `(${order.discount})` : ""}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Tag color="blue">
                    {formatCurrency(order.discountPrice || 0)}
                  </Tag>
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>
                  {t("ORDER_TOTAL")}:
                </Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  <Tag color="blue">
                    {formatCurrency(order.totalPrice || 0)}
                  </Tag>
                </Typography.Paragraph>
              </Col>
            </Row>
          </Col>

          <Col span={12}>
            <Typography.Title level={5}>
              {t("ORDER_SEATS_SERVICES")}
            </Typography.Title>
            <Divider />

            {order.ticketItems && order.ticketItems.length > 0 ? (
              <TicketTable ticketItems={order.ticketItems} />
            ) : (
              <Typography.Text type="secondary">
                {t("TICKET_NO_TICKETS")}
              </Typography.Text>
            )}

            {order.serviceItems && order.serviceItems.length > 0 && (
              <ServiceTable serviceItems={order.serviceItems} />
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default OrderDetail;
