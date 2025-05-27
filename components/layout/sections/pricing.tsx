import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const plans: PlanProps[] = [
  {
    title: "Cao cấp/Tháng",
    popular: 0,
    price: 39000,
    description:
      "Gói cao cấp theo tháng dành cho những bậc phụ huynh muốn theo dõi sự phát triển của bé một cách chi tiết và đầy đủ.",
    buttonText: "Mua ngay",
    benefitList: [
      "Nhật ký theo dõi bé (Không giới hạn, thêm ảnh và video, xuất pdf)",
      "Theo dõi sức khỏe (Biểu đồ sức khỏe, lịch tiêm chủng, nhật ký khám)",
      "Lịch học (Nhắc lịch thông minh, theo dõi tiến độ học tập)",
      "Thư viện kiến thức (Toàn bộ kiến thức về nuôi dạy trẻ)",
      "Cộng đồng (Kết nối với các bậc phụ huynh khác)",
    ],
  },
  {
    title: "Cao cấp/Quý",
    popular: 1,
    price: 99000,
    description:
      "Gói cao cấp theo tháng dành cho những bậc phụ huynh muốn theo dõi sự phát triển của bé một cách chi tiết và đầy đủ.",
    buttonText: "Mua ngay",
    benefitList: [
      "Nhật ký theo dõi bé (Không giới hạn, thêm ảnh và video, xuất pdf)",
      "Theo dõi sức khỏe (Biểu đồ sức khỏe, lịch tiêm chủng, nhật ký khám)",
      "Lịch học (Nhắc lịch thông minh, theo dõi tiến độ học tập)",
      "Thư viện kiến thức (Toàn bộ kiến thức về nuôi dạy trẻ)",
      "Cộng đồng (Kết nối với các bậc phụ huynh khác)",
    ],
  },
  {
    title: "Gia đình",
    popular: 0,
    price: 150000,
    description:
      "Gói gia đình dành cho những bậc phụ huynh có nhiều con và muốn theo dõi sự phát triển của tất cả các bé trong gia đình.",
    buttonText: "Mua ngay",
    benefitList: [
      "Theo dõi nhiều hồ sơ trong một tài khoản (Phù hợp cho những gia đình có 2 con trở lên)",
      "Lịch gia đình (Theo dõi lịch học, lịch tiêm chủng, lịch khám sức khỏe của tất cả các bé trong gia đình)",
      "Chia sẻ nhật ký (Cho phép các thành viên trong gia đình cùng theo dõi và cập nhật nhật ký của bé)",
      "Cộng đồng gia đình (Kết nối với các bậc phụ huynh khác trong cùng một gia đình)",
      "Hỗ trợ ưu tiên (Được hỗ trợ nhanh chóng và ưu tiên trong việc giải quyết các vấn đề liên quan đến tài khoản)",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Bảng giá
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Nhận quyền truy cập không giới hạn
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Xem bảng giá với giá cả hợp lý
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">{price}đ</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h4>{benefit}</h4>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
