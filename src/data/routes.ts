import {
  BulbOutlined,
  CalculatorOutlined,
  CarOutlined,
  CopyrightOutlined,
  FileTextOutlined,
  PieChartOutlined,
  ProjectOutlined,
  ReadOutlined,
  RobotOutlined,
  RocketOutlined,
  TabletOutlined,
  TeamOutlined,
  UserOutlined,
  TrophyOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

export const getMenuData = (t: (key: string) => string) => [
  {
    id: 1,
    label: t("DASHBOARD"),
    icon: PieChartOutlined,
    url: "/admin/dashboard",
    subs: [
      {
        id: 11,
        label: t("OVERVIEW"),
        url: "/admin/dashboard",
      },
      {
        id: 12,
        label: t("REVENUE_BY_MOVIE"),
        url: "/admin/revenue/movie",
      },
      {
        id: 13,
        label: t("REVENUE_BY_CINEMA"),
        url: "/admin/revenue/cinema",
      },
    ],
  },
  {
    id: 7,
    label: t("CINEMA_MANAGEMENT"),
    icon: RobotOutlined,
    url: "/admin/cinemas",
    subs: [
      {
        id: 71,
        label: t("CINEMA_LIST"),
        url: "/admin/cinemas",
      }
    ],
  },
  {
    id: 8,
    label: t("MOVIE_MANAGEMENT"),
    icon: TabletOutlined,
    url: "/admin/movies",
    subs: [
      {
        id: 81,
        label: t("MOVIE_LIST"),
        url: "/admin/movies",
      }
    ],
  },
  {
    id: 9,
    label: t("SCHEDULE_MANAGEMENT"),
    icon: BulbOutlined,
    url: "/admin/schedules",
    subs: [
      {
        id: 91,
        label: t("SCHEDULE_LIST"),
        url: "/admin/schedules",
      },
    ],
  },
  {
    id: 100,
    label: t("SHOWTIME_MANAGEMENT"),
    icon: CopyrightOutlined,
    url: "/admin/showtimes",
    subs: [
      {
        id: 1002,
        label: t("SHOWTIME_LIST"),
        url: "/admin/showtimes",
      },
    ],
  },
  {
    id: 400,
    label: t("ORDER_MANAGEMENT"),
    icon: CarOutlined,
    url: "/admin/orders",
    subs: [
      {
        id: 4001,
        label: t("ORDER_LIST"),
        url: "/admin/orders",
      },
    ],
  },
  {
    id: 200,
    label: t("TICKET_PRICE_MANAGEMENT"),
    icon: CalculatorOutlined,
    url: "/admin/ticket-prices",
    subs: [
      {
        id: 2001,
        label: t("BASE_TICKET_PRICE"),
        url: "/admin/ticket-prices/base-price",
      },
    ],
  },
  {
    id: 300,
    label: t("COUPON_MANAGEMENT"),
    icon: CarOutlined,
    url: "/admin/coupons",
    subs: [
      {
        id: 3001,
        label: t("COUPON_LIST"),
        url: "/admin/coupons",
      },
    ],
  },
  {
    id: 2,
    label: t("BLOG_MANAGEMENT"),
    icon: FileTextOutlined,
    url: "/admin/blogs",
    subs: [
      {
        id: 21,
        label: t("ALL_BLOGS"),
        url: "/admin/blogs",
      },
      {
        id: 22,
        label: t("MY_BLOGS"),
        url: "/admin/blogs/own-blogs",
      },
    ],
  },
  {
    id: 3,
    label: t("USER_MANAGEMENT"),
    icon: UserOutlined,
    url: "/admin/users",
    subs: [
      {
        id: 31,
        label: t("USER_LIST"),
        url: "/admin/users",
      }
    ],
  },
  {
    id: 4,
    label: t("GENRE_MANAGEMENT"),
    icon: TeamOutlined,
    url: "/admin/genres",
    subs: [
      {
        id: 41,
        label: t("GENRE_LIST"),
        url: "/admin/genres",
      },
    ],
  },
  {
    id: 5,
    label: t("COUNTRY_MANAGEMENT"),
    icon: ProjectOutlined,
    url: "/admin/countries",
    subs: [
      {
        id: 51,
        label: t("COUNTRY_LIST"),
        url: "/admin/countries",
      },
    ],
  },
  {
    id: 6,
    label: t("ADDITIONAL_SERVICE_MANAGEMENT"),
    icon: ReadOutlined,
    url: "/admin/additional-services",
    subs: [
      {
        id: 61,
        label: t("ADDITIONAL_SERVICE_LIST"),
        url: "/admin/additional-services",
      }
    ],
  },
  {
    id: 700,
    label: t("PRODUCT_MANAGEMENT"),
    icon: ShoppingOutlined,
    url: "/admin/products",
    subs: [
      {
        id: 7001,
        label: t("PRODUCT_LIST"),
        url: "/admin/products",
      }
    ],
  },
  {
    id: 500,
    label: t("DIRECTOR_MANAGEMENT"),
    icon: RocketOutlined,
    url: "/admin/directors",
    subs: [
      {
        id: 5001,
        label: t("DIRECTOR_LIST"),
        url: "/admin/directors",
      },
    ],
  },
  {
    id: 600,
    label: t("ACTOR_MANAGEMENT"),
    icon: TrophyOutlined,
    url: "/admin/actors",
    subs: [
      {
        id: 6001,
        label: t("ACTOR_LIST"),
        url: "/admin/actors",
      },
    ],
  },
];

// Default menu without translation for backward compatibility
const menu = getMenuData((key: string) => key);

export default menu;
