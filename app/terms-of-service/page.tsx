import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-pink-100 to-blue-100 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Điều Khoản Dịch Vụ</CardTitle>
            <p className="text-lg text-gray-600">NotBy - Sổ Tay Kỷ Niệm Của Bé</p>
            <p className="text-sm text-gray-500 mt-2">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Giới thiệu */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Giới Thiệu</h2>
              <p className="text-gray-700 leading-relaxed">
                Chào mừng bạn đến với NotBy! Chúng tôi cung cấp nền tảng số để các bậc phụ huynh lưu trữ và chia sẻ
                những kỷ niệm quý giá của con em mình. Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các
                điều khoản và điều kiện được nêu dưới đây.
              </p>
            </section>

            <Separator />

            {/* Định nghĩa dịch vụ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Định Nghĩa Dịch Vụ</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>NotBy</strong> là nền tảng trực tuyến cho phép người dùng:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Tạo và quản lý sổ tay kỷ niệm số cho con em</li>
                  <li>Lưu trữ hình ảnh, video và ghi chú về sự phát triển của bé</li>
                  <li>Chia sẻ kỷ niệm với gia đình và bạn bè</li>
                  <li>Tạo timeline phát triển và milestone của bé</li>
                  <li>In ấn sổ tay thành sách vật lý (nếu có)</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Tài khoản người dùng */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Tài Khoản Người Dùng</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 Đăng Ký Tài Khoản</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Thông tin đăng ký phải chính xác và đầy đủ</li>
                    <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Trách Nhiệm Người Dùng</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Không chia sẻ tài khoản với người khác</li>
                    <li>Thông báo ngay khi phát hiện tài khoản bị xâm nhập</li>
                    <li>Sử dụng dịch vụ một cách hợp pháp và phù hợp</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Nội dung và quyền riêng tư */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Nội Dung và Quyền Riêng Tư</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.1 Nội Dung Của Bạn</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Bạn sở hữu hoàn toàn nội dung mà bạn tải lên</li>
                    <li>Bạn chịu trách nhiệm về tính hợp pháp của nội dung</li>
                    <li>Không tải lên nội dung vi phạm pháp luật hoặc bản quyền</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">4.2 Quyền Riêng Tư</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn</li>
                    <li>Nội dung chỉ được chia sẻ theo cài đặt riêng tư của bạn</li>
                    <li>Chúng tôi không bán thông tin cá nhân cho bên thứ ba</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Sở hữu trí tuệ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Sở Hữu Trí Tuệ</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>5.1 Quyền của NotBy:</strong> Tất cả các tính năng, giao diện, logo và công nghệ của
                  NotBy thuộc sở hữu của chúng tôi.
                </p>
                <p>
                  <strong>5.2 Quyền của Người Dùng:</strong> Bạn giữ nguyên quyền sở hữu đối với tất cả nội dung cá nhân
                  mà bạn tải lên.
                </p>
                <p>
                  <strong>5.3 Giấy Phép Sử Dụng:</strong> Bằng cách tải nội dung lên, bạn cấp cho chúng tôi giấy phép để
                  lưu trữ, xử lý và hiển thị nội dung theo cài đặt riêng tư của bạn.
                </p>
              </div>
            </section>

            <Separator />

            {/* Hạn chế trách nhiệm */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Hạn Chế Trách Nhiệm</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>6.1 Tính Khả Dụng:</strong> Chúng tôi cố gắng duy trì dịch vụ 24/7 nhưng không đảm bảo 100%
                  thời gian hoạt động.
                </p>
                <p>
                  <strong>6.2 Mất Dữ Liệu:</strong> Mặc dù chúng tôi có hệ thống sao lưu, bạn nên tự sao lưu dữ liệu
                  quan trọng.
                </p>
                <p>
                  <strong>6.3 Giới Hạn Bồi Thường:</strong> Trách nhiệm của chúng tôi được giới hạn trong phạm vi phí
                  dịch vụ mà bạn đã thanh toán.
                </p>
              </div>
            </section>

            <Separator />

            {/* Chấm dứt dịch vụ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Chấm Dứt Dịch Vụ</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>7.1 Chấm Dứt Bởi Người Dùng:</strong> Bạn có thể hủy tài khoản bất cứ lúc nào thông qua cài
                  đặt tài khoản.
                </p>
                <p>
                  <strong>7.2 Chấm Dứt Bởi NotBy:</strong> Chúng tôi có quyền chấm dứt tài khoản vi phạm điều khoản
                  dịch vụ.
                </p>
                <p>
                  <strong>7.3 Sau Chấm Dứt:</strong> Bạn có 30 ngày để tải xuống dữ liệu trước khi tài khoản bị xóa vĩnh
                  viễn.
                </p>
              </div>
            </section>

            <Separator />

            {/* Thanh toán */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Thanh Toán và Hoàn Tiền</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>8.1 Gói Dịch Vụ:</strong> NotBy cung cấp cả gói miễn phí và gói trả phí với tính năng nâng
                  cao.
                </p>
                <p>
                  <strong>8.2 Thanh Toán:</strong> Phí dịch vụ được thu theo tháng/năm và tự động gia hạn.
                </p>
                <p>
                  <strong>8.3 Hoàn Tiền:</strong> Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày đầu tiên cho gói
                  trả phí.
                </p>
              </div>
            </section>

            <Separator />

            {/* Thay đổi điều khoản */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Thay Đổi Điều Khoản</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có quyền cập nhật các điều khoản này. Những thay đổi quan trọng sẽ được thông báo qua email
                hoặc thông báo trên website ít nhất 30 ngày trước khi có hiệu lực. Việc tiếp tục sử dụng dịch vụ sau khi
                thay đổi có nghĩa là bạn chấp nhận các điều khoản mới.
              </p>
            </section>

            <Separator />

            {/* Liên hệ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Thông Tin Liên Hệ</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> support@notby.vn
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> 0123-456-789
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> FPT University, Phường Hòa Hải, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng
                  </p>
                  <p>
                    <strong>Giờ hỗ trợ:</strong> Thứ 2 - Thứ 6, 9:00 - 18:00
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 border-t">
              <p className="text-sm text-gray-500">© 2025 NotBy. Tất cả quyền được bảo lưu.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
