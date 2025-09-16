import { Modal, Spin } from "antd";
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
  const { data: seats, isLoading: isLoadingGetSeats } =
    useGetSeatsByAuditoriumQuery(auditorium.id);

  if (isLoadingGetSeats) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <>
      <Modal
        open={open}
        title="Cập nhật ghế phòng chiếu"
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
