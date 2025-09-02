import { Divider, Typography } from "antd";
import { formatDate } from "@utils/functionUtils";
import ShowtimesByAuditorium from "./ShowtimesByAuditorium";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

interface Cinema {
  id: string;
  name: string;
}

interface Auditorium {
  id: string;
  name: string;
}

interface AuditoriumData {
  auditorium: Auditorium;
  showtimes: any[];
}

interface CinemaData {
  cinema: Cinema;
  auditoriums: AuditoriumData[];
}

interface ShowtimesTableProps {
  data: CinemaData[];
  dateSelected: Dayjs;
}

const ShowtimesTable = ({ data, dateSelected }: ShowtimesTableProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Divider>
        {t("SHOW_DATE")}: {formatDate(dateSelected.toDate())}
      </Divider>
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <Typography.Title
              level={5}
              style={{
                color: "#fff",
                backgroundColor: "#1677ff",
                textAlign: "center",
                boxShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
                borderRadius: "6px",
                padding: "8px 16px",
              }}
            >
              {t("CINEMA")}: {item.cinema.name}
            </Typography.Title>
            {item.auditoriums.map((data, index) => (
              <ShowtimesByAuditorium
                key={index}
                data={data}
                cinema={item.cinema}
                auditorium={data.auditorium}
                dateSelected={dateSelected}
              />
            ))}
          </div>
        ))}
    </>
  );
};
export default ShowtimesTable;
