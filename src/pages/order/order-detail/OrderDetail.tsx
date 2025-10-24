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

const parseOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Tag color="default">Chờ xác nhận</Tag>;
    case "CONFIRMED":
      return <Tag color="success">Đã thanh toán</Tag>;
    case "CANCELLED":
      return <Tag color="error">Đã hủy</Tag>;
    case "RETURNED":
      return <Tag color="purple">Đã trả hàng</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
};
const OrderDetail = () => {
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
      title: "Xác nhận trả hàng",
      width: 520,
      centered: true,
      content: (
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
            Lý do trả hàng <Typography.Text type="danger">*</Typography.Text>
          </Typography.Text>
          <Input.TextArea
            rows={4}
            onChange={(e) => {
              reason = e.target.value;
            }}
            placeholder="Ví dụ: Khách hàng yêu cầu hủy, lỗi hệ thống thanh toán..."
            style={{ resize: "none", marginBottom: 4 }}
            maxLength={500}
            showCount
          />
        </div>
      ),
      okText: "Xác nhận trả hàng",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        if (!reason || reason.trim() === "") {
          message.error("Vui lòng nhập lý do trả hàng.");
          return Promise.reject();
        }
        try {
          await returnOrder({
            orderId: Number(orderId),
            reason: reason,
          }).unwrap();
          message.success(
            "Trả hàng thành công. Email thông báo đã được gửi cho khách hàng."
          );
        } catch (err: any) {
          message.error(
            err?.data?.error || "Trả hàng thất bại. Vui lòng thử lại."
          );
          return Promise.reject();
        }
      },
    });
  };

  const breadcrumb = [
    { label: "Danh sách đơn hàng", href: "/admin/orders" },
    {
      label: `Đơn hàng ${order?.id}`,
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
        <title>{`Đơn hàng ${order?.id}`}</title>
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
                Quay lại
              </Button>
            </RouterLink>
            {canReturn() && (
              <Button
                type="primary"
                danger
                onClick={handleReturn}
                loading={isReturning}
              >
                Trả hàng
              </Button>
            )}
          </Space>
        </Flex>

        <Row gutter={16}>
          <Col span={6}>
            <Typography.Title level={5}>Thông tin đơn hàng</Typography.Title>
            <Divider />
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Mã đơn hàng:</Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>{order?.id}</Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Phim:</Typography.Paragraph>
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
                <Typography.Paragraph strong>Giờ chiếu:</Typography.Paragraph>
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
                <Typography.Paragraph strong>Ngày chiếu:</Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {formatDate(order.showtime.date)}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Phòng chiếu:</Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {order.showtime.auditorium.name}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Rạp chiếu:</Typography.Paragraph>
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
                <Typography.Paragraph strong>Ngày đặt:</Typography.Paragraph>
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
                  Thông tin trả hàng
                </Typography.Title>
                <Row>
                  <Col span={7}>
                    <Typography.Paragraph strong>
                      Người xử lý:
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
                    <Typography.Paragraph strong>Email:</Typography.Paragraph>
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
                      Thời gian trả:
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
                      Lý do trả:
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
            <Typography.Title level={5}>Thông tin khách hàng</Typography.Title>
            <Divider />
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Khách hàng:</Typography.Paragraph>
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
                <Typography.Paragraph strong>Điện thoại:</Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>{order?.user.phone}</Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Email:</Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>{order?.user.email}</Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Trạng thái:</Typography.Paragraph>
              </Col>
              <Col span={17}>
                <Typography.Paragraph>
                  {parseOrderStatus(order.status)}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <Typography.Paragraph strong>Thành tiền:</Typography.Paragraph>
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
                  Giảm giá {order.discount ? `(${order.discount})` : ""}:
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
                <Typography.Paragraph strong>Tổng tiền:</Typography.Paragraph>
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
            <Typography.Title level={5}>Ghế & Dịch vụ</Typography.Title>
            <Divider />

            {order.ticketItems && order.ticketItems.length > 0 ? (
              <TicketTable ticketItems={order.ticketItems} />
            ) : (
              <Typography.Text type="secondary">Chưa có vé</Typography.Text>
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
