import { Row } from "antd";
import RowSeatAction from "./RowSeatAction";
import Seat from "./Seat";
import type { Seat as SeatType, Auditorium } from "@/types";

interface SeatMatrixProps {
  seats: SeatType[];
  auditorium: Auditorium;
}

function SeatMatrix({ seats, auditorium }: SeatMatrixProps) {
  const isLastRow = (rowIndex: number) => {
    return (
      rowIndex === Math.max(...seats.map((seat: SeatType) => seat.rowIndex))
    );
  };
  return (
    <div>
      {
        // Tạo ra các hàng
        Array.from(new Set(seats.map((seat: SeatType) => seat.rowIndex))).map(
          (row: number) => (
            <Row key={row} gutter={[8, 8]} justify={"center"}>
              {
                // Tạo ra các ghế trong từng hàng
                seats
                  .filter((seat: SeatType) => seat.rowIndex === row)
                  .map((seat: SeatType) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isLastRow={isLastRow(row)}
                      auditorium={auditorium}
                    />
                  ))
              }
              <RowSeatAction
                rowIndex={row}
                isLastRow={isLastRow(row)}
                auditorium={auditorium}
              />
            </Row>
          ),
        )
      }
    </div>
  );
}

export default SeatMatrix;
