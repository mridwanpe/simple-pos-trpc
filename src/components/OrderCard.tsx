import { Button } from "@/components/ui/button";
import { toRupiah } from "@/utils/toRupiah";
import { OrderStatus } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface OrderCardProps {
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  onFinishOrder?: (orderId: string) => void;
}

export const OrderCard = ({
  id,
  status,
  totalAmount,
  totalItems,
  onFinishOrder,
}: OrderCardProps) => {
  const handleFinishOrder = () => {};

  const getBadgeColor = () => {
    switch (status) {
      case OrderStatus.AWAITING_PAYMENT:
        return "bg-yellow-200 text-yellow-800";
      case OrderStatus.PROCESSING:
        return "bg-blue-200 text-blue-800";
      case OrderStatus.DONE:
        return "bg-green-200 text-green-800";
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex w-full justify-between items-center">
          <Tooltip>
            <TooltipTrigger>Order ID</TooltipTrigger>
            <TooltipContent>
              <p>{id}</p>
            </TooltipContent>
          </Tooltip>
          <h1
            className={`rounded-full w-fit h-fit px-3 py-0.5 text-[9px] font-medium ${getBadgeColor()}`}
          >
            {status}
          </h1>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Total Amount
          </h4>
          <p className="text-lg font-bold">{toRupiah(totalAmount)}</p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Total Items
          </h4>
          <p className="text-lg font-bold">{totalItems}</p>
        </div>
      </div>

      {status === OrderStatus.PROCESSING && (
        <Button onClick={handleFinishOrder} className="w-full" size="sm">
          Finish Order
        </Button>
      )}
    </div>
  );
};
