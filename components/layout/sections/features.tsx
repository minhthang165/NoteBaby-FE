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
    title: "Quản lý học viên",
    description:
      "Theo dõi thông tin học viên, lịch sử học tập, kết quả và tiến độ học tập.",
  },
  {
    icon: "BookOpen",
    title: "Quản lý khóa học",
    description:
      "Tạo và quản lý các khóa học, lịch học, tài liệu giảng dạy và bài tập.",
  },
  {
    icon: "CalendarClock",
    title: "Lịch giảng dạy",
    description:
      "Sắp xếp lịch giảng dạy cho giáo viên, phòng học và theo dõi thời gian biểu.",
  },
  {
    icon: "BarChart3",
    title: "Báo cáo thống kê",
    description:
      "Tạo báo cáo về tình hình học tập, tài chính và hiệu quả giảng dạy.",
  },
  {
    icon: "FileText",
    title: "Quản lý tài liệu",
    description:
      "Lưu trữ và chia sẻ tài liệu giảng dạy, bài giảng và tài nguyên học tập.",
  },
  {
    icon: "MessageSquare",
    title: "Giao tiếp nội bộ",
    description:
      "Hệ thống tin nhắn và thông báo giữa giáo viên, học viên và quản lý.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Tính năng
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Giải pháp toàn diện cho trung tâm giáo dục
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Nền tảng của chúng tôi cung cấp đầy đủ các công cụ cần thiết để quản lý hiệu quả mọi hoạt động của trung tâm giảng dạy.
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
