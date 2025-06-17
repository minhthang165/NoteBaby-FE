import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Award, Lightbulb, Clock, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react"
import { FooterSection } from "@/components/layout/sections/footer"
import { HeroAboutUsSection } from "@/components/layout/sections/hero-about-us"

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroAboutUsSection/>

      {/* Mission & Vision */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-black">
                Sứ mệnh của chúng tôi
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Mỗi đứa trẻ là một phép màu nhỏ bé, và mỗi khoảnh khắc cùng con đều vô giá.
              </h2>
              <p className="text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NotBy ra đời từ những trang nhật ký đầu tiên của một người mẹ trẻ – người luôn sợ rằng mình sẽ quên mất
                nụ cười đầu tiên của con, tiếng gọi “mẹ” đầu đời, hay lần bé chập chững những bước đi đầu tiên. Những khoảnh
                khắc ấy không thể quay lại, và chúng xứng đáng được lưu giữ trọn vẹn.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <Lightbulb className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Lưu giữ</h3>
                    <p className="text-sm text-gray-800">
                      Ghi chú hành trình lớn khôn của bé bằng hình ảnh, video và câu chuyện đầy cảm xúc.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <Users className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Cộng đồng</h3>
                    <p className="text-sm text-gray-800">
                      Kết nối với các cha mẹ khác để cùng sẻ chia kinh nghiệm, niềm vui và lời khuyên hữu ích.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <Award className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Theo dõi</h3>
                    <p className="text-sm text-gray-800">
                      Theo dõi tăng trưởng, lịch tiêm chủng, giấc ngủ và sức khỏe của bé một cách khoa học.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <BookOpen className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Kiến thức</h3>
                    <p className="text-sm text-gray-800">
                      Truy cập thư viện bài viết, video và tài liệu chuyên sâu từ chuyên gia nuôi dạy trẻ.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
    </section>


      {/* Our Programs */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-black">
                Tính năng nổi bật
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Hỗ trợ cha mẹ từ những điều nhỏ nhất
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                 NotBy giúp bạn đồng hành cùng con bằng cách lưu giữ kỷ niệm, theo dõi phát triển và tiếp cận nguồn tài nguyên đáng tin cậy.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="flex flex-col overflow-hidden border border-gray-200 transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <Badge className="mb-2" variant={program.badgeVariant}>
                    {program.badge}
                  </Badge>
                  <h3 className="text-2xl font-bold text-black">{program.title}</h3>
                  <p className="mt-2 text-gray-800">{program.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-800">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link href={program.link}>
                        Tìm hiểu thêm
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Approach */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-black">
                Phương pháp chăm sóc
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Cách NotBy hỗ trợ mẹ và bé toàn diện
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Phương pháp chăm sóc của NotBy kết hợp giữa kiến thức y khoa, công nghệ và sự thấu cảm để đồng hành cùng hành trình làm mẹ một cách thông minh và an toàn.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="practice">Theo dõi sức khỏe</TabsTrigger>
                <TabsTrigger value="projects">Tư vấn cá nhân</TabsTrigger>
                <TabsTrigger value="mentoring">Chuyên gia đồng hành</TabsTrigger>
                <TabsTrigger value="community">Cộng đồng mẹ bầu</TabsTrigger>
              </TabsList>

              {/* Theo dõi sức khỏe */}
              <TabsContent value="practice" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Theo dõi sức khỏe mẹ & bé</h3>
                    <p className="text-gray-800 mb-4">
                      NotBy cung cấp công cụ thông minh để mẹ theo dõi thai kỳ, lịch tiêm chủng, cử động thai và các chỉ số sức khỏe của bé một cách khoa học.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Lịch tiêm chủng tự động",
                        "Theo dõi cân nặng, chiều cao, vòng đầu",
                        "Gợi ý thực đơn dinh dưỡng mỗi giai đoạn",
                        "Biểu đồ phát triển trực quan",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src="/health-tracking.jpg?height=300&width=400"
                      alt="Health tracking on NotBy"
                      className="rounded-lg object-cover w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tư vấn cá nhân */}
              <TabsContent value="projects" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Tư vấn cá nhân 1:1</h3>
                    <p className="text-gray-800 mb-4">
                      Các chuyên gia của NotBy luôn sẵn sàng tư vấn 1:1 về dinh dưỡng, tâm lý, chăm sóc bé và hỗ trợ mẹ bầu chuẩn bị hành trình làm mẹ tốt nhất.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Tư vấn dinh dưỡng theo tuần thai",
                        "Giải đáp các vấn đề sức khỏe mẹ & bé",
                        "Gợi ý bài tập nhẹ nhàng cho mẹ bầu",
                        "Hướng dẫn chăm sóc bé sơ sinh",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src="/consultation.jpg?height=300&width=400"
                      alt="Consultation session"
                      className="rounded-lg object-cover w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Chuyên gia đồng hành */}
              <TabsContent value="mentoring" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Đồng hành cùng chuyên gia</h3>
                    <p className="text-gray-800 mb-4">
                      Đội ngũ bác sĩ, chuyên gia dinh dưỡng và tâm lý của NotBy đồng hành cùng mẹ trong từng giai đoạn – từ mang thai đến sau sinh.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Lịch hẹn chuyên gia định kỳ",
                        "Hỏi đáp nhanh qua ứng dụng",
                        "Video hướng dẫn chăm sóc bé",
                        "Chia sẻ kinh nghiệm từ bác sĩ sản nhi",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src="/mentoring.jpg?height=300&width=400"
                      alt="Expert mentoring"
                      className="rounded-lg object-cover w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Cộng đồng mẹ bầu */}
              <TabsContent value="community" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Cộng đồng mẹ bầu</h3>
                    <p className="text-gray-800 mb-4">
                      Cộng đồng mẹ bầu NotBy là nơi để các mẹ chia sẻ kinh nghiệm, nhận động lực và cùng nhau vượt qua hành trình làm mẹ đầy yêu thương.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Nhóm hỗ trợ theo từng tuần thai",
                        "Sự kiện offline cho mẹ & bé",
                        "Live talk cùng chuyên gia mỗi tuần",
                        "Thử thách chăm sóc sức khỏe mẹ & bé",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src="/community.png?height=300&width=400"
                      alt="Mom community event"
                      className="rounded-lg object-cover w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>


      {/* Our Team */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-black">
                Đội ngũ của chúng tôi
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Gặp gỡ những người chung tay xây dựng NotBy
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Chúng tôi là một đội ngũ đam mê công nghệ và giáo dục, luôn nỗ lực mang đến những trải nghiệm tốt nhất cho cha mẹ và trẻ em.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <img alt={instructor.name} className="object-cover" src={instructor.image || "/placeholder.svg"} />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold text-black">{instructor.name}</h3>
                  <p className="text-sm text-primary font-medium">{instructor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}

// Data
type BadgeVariant = "default" | "secondary" | "outline" | "destructive" | null | undefined;

type Program = {
  title: string;
  description: string;
  duration: string;
  badge: string;
  badgeVariant: BadgeVariant;
  link: string;
};

const programs: Program[] = [
  {
    title: "Nhật ký bé yêu",
    description: "Lưu lại từng khoảnh khắc đáng nhớ của bé từ lúc mới sinh đến từng bước phát triển.",
    duration: "Không giới hạn",
    badge: "Nhật ký bé yêu",
    badgeVariant: "default",
    link: "/courses/frontend",
  },
  {
    title: "Theo dõi sức khỏe",
    description: "Theo dõi chiều cao, cân nặng, giấc ngủ và các chỉ số quan trọng khác của bé.",
    duration: "Theo dõi sức khỏe",
    badge: "Bán chạy",
    badgeVariant: "secondary",
    link: "/courses/fullstack",
  },
  {
    title: "Kiến thức nuôi con",
    description: "Truy cập tài liệu từ bác sĩ, chuyên gia giáo dục và cộng đồng giàu kinh nghiệm.",
    duration: "Cập nhật liên tục",
    badge: "Mới",
    badgeVariant: "outline",
    link: "/courses/mobile",
  },
]

const instructors = [
  {
    name: "Nguyễn Minh Thắng",
    role: "Lead Developer - Fullstack",
    image: "/minh-thang.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Hữu Anh Tuấn",
    role: "Developer - Fullstack",
    image: "/tuan.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Bá Trung Nguyên",
    role: "Developer - Frontend",
    image: "/trung-nguyen.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Hà Phương",
    role: "International Business",
    image: "/phuong.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Anna Anh Thư",
    role: "International Business",
    image: "/thu.jpg?height=200&width=200",
  },
  {
    name: "Nguyễn Minh Tú",
    role: "International Business",
    image: "/tu.jpg?height=200&width=200",
  },
]

const testimonials = [
  {
    name: "Nguyễn Thị Lan",
    course: "Khóa học Fullstack Web",
    quote:
      "Sau khi hoàn thành khóa học, tôi đã tìm được việc làm tại một công ty phần mềm với mức lương tốt. Phương pháp giảng dạy thực tế và hỗ trợ từ các mentor đã giúp tôi rất nhiều.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Trần Văn Bình",
    course: "Khóa học Frontend",
    quote:
      "Tôi đã thử nhiều khóa học online nhưng không hiệu quả. Tại NextEducation, tôi được thực hành nhiều và có người hướng dẫn trực tiếp, giúp tôi tiến bộ nhanh chóng.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Lê Hoàng Minh",
    course: "Khóa học Mobile Development",
    quote:
      "Giảng viên rất tận tâm và có kinh nghiệm thực tế. Dự án cuối khóa đã giúp tôi xây dựng portfolio ấn tượng để phỏng vấn việc làm.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Phạm Thị Hoa",
    course: "Khóa học Data Science",
    quote:
      "Nội dung khóa học cập nhật với xu hướng công nghệ mới nhất. Tôi đặc biệt ấn tượng với các bài tập thực tế sử dụng dữ liệu từ các doanh nghiệp.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Đỗ Quang Hải",
    course: "Khóa học DevOps",
    quote:
      "Khóa học đã giúp tôi chuyển đổi từ developer sang DevOps engineer. Kiến thức thực tế và môi trường lab chuyên nghiệp là điểm mạnh của NextEducation.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Vũ Thị Thanh",
    course: "Khóa học Game Development",
    quote:
      "Tôi đã có thể phát hành game đầu tiên của mình sau khi học tại NextEducation. Các giảng viên không chỉ dạy code mà còn chia sẻ kinh nghiệm làm việc thực tế.",
    image: "/placeholder.svg?height=100&width=100",
  },
]
