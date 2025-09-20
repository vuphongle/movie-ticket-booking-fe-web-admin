import { Modal, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useGetSeatsByAuditoriumQuery } from "@/app/services/seats.service";
import CinemaScreen from "./seat/CinemaScreen";
import SeatLegend from "./seat/SeatLegend";
import SeatMatrix from "./seat/SeatMatrix";
import type { Auditorium } from "@/types";

interface SeatModalProps {
  auditorium: Auditorium;
  open: boolean;
  onCancel: () => void;
  cinemaId: number;
}

function SeatModal(props: SeatModalProps) {
  const { auditorium, open, onCancel } = props;
  const { t } = useTranslation();
  const { data: seats, isLoading: isLoadingGetSeats } =
    useGetSeatsByAuditoriumQuery(auditorium.id);

  if (isLoadingGetSeats) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Modal
        open={open}
        title={t("UPDATE_SEAT_TITLE")}
        footer={null}
        onCancel={onCancel}
        width={1000}
      >
        <CinemaScreen />
        <SeatMatrix seats={seats} auditorium={auditorium} />
        <SeatLegend />
      </Modal>
    </>
  );
}

export default SeatModal;
