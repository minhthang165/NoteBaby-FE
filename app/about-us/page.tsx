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
                Trao quyền cho thế hệ lập trình viên tương lai
              </h2>
              <p className="text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NextEducation được thành lập với mục tiêu cung cấp giáo dục lập trình chất lượng cao, giúp học viên phát
                triển kỹ năng cần thiết để thành công trong ngành công nghệ thông tin.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <Lightbulb className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Đổi mới</h3>
                    <p className="text-sm text-gray-800">
                      Luôn cập nhật với công nghệ mới nhất và phương pháp giảng dạy hiện đại
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <Users className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Cộng đồng</h3>
                    <p className="text-sm text-gray-800">
                      Xây dựng môi trường học tập hỗ trợ và cộng đồng lập trình viên
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <Award className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Chất lượng</h3>
                    <p className="text-sm text-gray-800">
                      Cam kết cung cấp nội dung giảng dạy chất lượng cao và trải nghiệm học tập xuất sắc
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                    <BookOpen className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-black">Thực tiễn</h3>
                    <p className="text-sm text-gray-800">
                      Tập trung vào kỹ năng thực tế và kiến thức áp dụng được trong công việc
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
                Chương trình đào tạo
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Khóa học đa dạng cho mọi nhu cầu
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NextEducation cung cấp nhiều khóa học lập trình từ cơ bản đến nâng cao, phù hợp với mọi đối tượng từ
                người mới bắt đầu đến chuyên gia.
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
                Phương pháp giảng dạy
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Cách chúng tôi đào tạo lập trình viên giỏi
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Phương pháp giảng dạy độc đáo của NextEducation kết hợp lý thuyết với thực hành, giúp học viên nhanh
                chóng áp dụng kiến thức vào dự án thực tế.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="practice">Thực hành</TabsTrigger>
                <TabsTrigger value="projects">Mock Interview</TabsTrigger>
                <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
                <TabsTrigger value="community">Cộng đồng</TabsTrigger>
              </TabsList>
              <TabsContent value="practice" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Học thông qua thực hành</h3>
                    <p className="text-gray-800 mb-4">
                      Chúng tôi tin rằng cách tốt nhất để học lập trình là thực hành. Học viên tại NextEducation dành
                      70% thời gian để thực hành code và giải quyết các bài tập thực tế.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Bài tập thực hành sau mỗi bài giảng",
                        "Coding challenges hàng tuần",
                        "Phòng lab với môi trường phát triển chuyên nghiệp",
                        "Code reviews từ giảng viên",
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
                      src="/students-practicing-coding.png?height=300&width=400"
                      alt="Students practicing coding"
                      className="rounded-lg object-cover w-full h-auto"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="projects" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Mock Interview</h3>
                    <p className="text-gray-800 mb-4">
                      Dịch vụ mock interview không chỉ giúp developer chuẩn bị tốt hơn cho phỏng vấn, mà còn là một công cụ hữu ích để phát triển kỹ năng chuyên môn và kỹ năng mềm. Tham gia mock interview là bước đầu tiên để chinh phục mọi thử thách trong sự nghiệp của bạn.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Môi Trường Thật",
                        "Phản Hồi Chính Xác",
                        "Hướng Dẫn Chi Tiết",
                        "Kỹ Năng Mềm",
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
                      src="/mock-interview.jpg?height=300&width=400"
                      alt="Students working on projects"
                      className="rounded-lg object-cover w-full h-auto"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="mentoring" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Mentoring 1:1</h3>
                    <p className="text-gray-800 mb-4">
                      Mỗi học viên được gán một mentor là lập trình viên có kinh nghiệm, hỗ trợ và hướng dẫn trong suốt
                      quá trình học tập.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Phiên mentoring hàng tuần",
                        "Hỗ trợ giải quyết vấn đề kỹ thuật",
                        "Tư vấn phát triển nghề nghiệp",
                        "Chia sẻ kinh nghiệm thực tế từ ngành",
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
                      alt="Mentoring session"
                      className="rounded-lg object-cover w-full h-auto"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="community" className="p-6 bg-white rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4 text-black">Cộng đồng học tập</h3>
                    <p className="text-gray-800 mb-4">
                      Chúng tôi xây dựng một cộng đồng học tập mạnh mẽ, nơi học viên có thể kết nối, chia sẻ và học hỏi
                      lẫn nhau.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Diễn đàn trao đổi kiến thức",
                        "Hackathons và coding competitions",
                        "Sự kiện networking với doanh nghiệp",
                        "Workshops và tech talks từ chuyên gia",
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
                      alt="Community event"
                      className="rounded-lg object-cover w-full h-auto"
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
                Đội ngũ giảng viên
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Gặp gỡ những chuyên gia sẽ hướng dẫn bạn
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Đội ngũ giảng viên của chúng tôi là những chuyên gia có nhiều năm kinh nghiệm trong ngành và đam mê chia
                sẻ kiến thức.
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
                  <p className="text-sm text-gray-800">{instructor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-black">
                Phản hồi học viên
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black">
                Học viên nói gì về chúng tôi
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hãy nghe những chia sẻ từ các học viên đã tham gia khóa học tại NextEducation.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      alt={testimonial.name}
                      className="rounded-full h-10 w-10 object-cover"
                      src={testimonial.image || "/placeholder.svg"}
                    />
                    <div>
                      <h3 className="font-bold text-black">{testimonial.name}</h3>
                      <p className="text-sm text-gray-800">{testimonial.course}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-800 italic">"{testimonial.quote}"</p>
                  </div>
                </CardContent>
              </Card>
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
    title: "Lập trình Web Frontend",
    description: "Học HTML, CSS, JavaScript và React để xây dựng giao diện web hiện đại và responsive.",
    duration: "4 tháng",
    badge: "Phổ biến",
    badgeVariant: "default",
    link: "/courses/frontend",
  },
  {
    title: "Lập trình Web Fullstack",
    description: "Phát triển ứng dụng web toàn diện với React, Node.js, và các cơ sở dữ liệu.",
    duration: "6 tháng",
    badge: "Bán chạy",
    badgeVariant: "secondary",
    link: "/courses/fullstack",
  },
  {
    title: "Lập trình Mobile",
    description: "Xây dựng ứng dụng di động đa nền tảng với React Native và Flutter.",
    duration: "5 tháng",
    badge: "Mới",
    badgeVariant: "outline",
    link: "/courses/mobile",
  },
  {
    title: "Data Science & AI",
    description: "Học phân tích dữ liệu, machine learning và trí tuệ nhân tạo với Python.",
    duration: "6 tháng",
    badge: "Nâng cao",
    badgeVariant: "outline",
    link: "/courses/data-science",
  },
  {
    title: "DevOps & Cloud",
    description: "Tìm hiểu về CI/CD, containerization và cloud computing với AWS và Azure.",
    duration: "4 tháng",
    badge: "Chuyên sâu",
    badgeVariant: "outline",
    link: "/courses/devops",
  },
  {
    title: "Lập trình Game",
    description: "Phát triển game 2D và 3D với Unity và các nguyên lý thiết kế game.",
    duration: "5 tháng",
    badge: "Sáng tạo",
    badgeVariant: "outline",
    link: "/courses/game-dev",
  },
]

const instructors = [
  {
    name: "Nguyễn Văn Anh",
    role: "Lead Instructor - Frontend",
    bio: "10+ năm kinh nghiệm phát triển web, chuyên gia React và JavaScript.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Trần Minh Tuấn",
    role: "Senior Instructor - Backend",
    bio: "Kỹ sư phần mềm với 8 năm kinh nghiệm về Node.js và microservices.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Lê Thị Hương",
    role: "Instructor - Mobile Development",
    bio: "Phát triển ứng dụng di động cho các doanh nghiệp lớn trong 6 năm.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Phạm Đức Thành",
    role: "Instructor - Data Science",
    bio: "Tiến sĩ Khoa học Máy tính với chuyên môn về AI và machine learning.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Hoàng Thị Mai",
    role: "Instructor - UX/UI Design",
    bio: "Nhà thiết kế UX/UI với kinh nghiệm làm việc tại các công ty công nghệ hàng đầu.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Vũ Quang Huy",
    role: "Instructor - DevOps",
    bio: "Chuyên gia DevOps và Cloud với chứng chỉ AWS và Azure.",
    image: "/placeholder.svg?height=200&width=200",
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
