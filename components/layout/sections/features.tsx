import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Users",
    title: "Ghi chú hành trình phát triển của bé",
    description:
      "Theo dõi các mốc quan trọng, nhật ký hằng ngày của bé.",
  },
  {
    icon: "BookOpen",
    title: "Lịch theo dõi & nhắc nhở",
    description:
      "Nhắc tiêm chủng đúng lịch, lịch khám sức khỏe định kỳ và thời gian biểu của bé.",
  },
  {
    icon: "FileText",
    title: "Thư viện tài nguyên – kiến thức",
    description:
      "Hướng dẫn chăm sóc bé theo từng độ tuổi, kèm video, bài viết từ chuyên gia.",
  },
  {
    icon: "BarChart3",
    title: "Theo dõi sức khỏe – tăng trưởng",
    description:
      "Tạo báo cáo, biểu đồ chiều cao, cân nặng theo tuổi.",
  },
  {
    icon: "MessageSquare",
    title: "Cộng đồng và hỗ trợ",
    description:
      "Diễn đàn hỏi đáp dành cho cha mẹ, hỗ trợ trực tuyến từ chuyên gia hoặc đội ngũ app.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Tính năng
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Giải pháp cho cha mẹ hiện đại
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        NotBy cung cấp các công cụ và tài nguyên cần thiết để cha mẹ theo dõi và hỗ trợ sự phát triển của bé yêu một cách toàn diện.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
