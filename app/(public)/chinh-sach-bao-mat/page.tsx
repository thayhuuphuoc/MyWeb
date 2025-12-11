import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
	title: "Chính sách Bảo mật",
	description: `Chính sách Bảo mật của ${siteMetadata.logoTitle}`,
};

export default function PrivacyPolicyPage() {
	return (
		<section>
			<div className="pb-16 md:pb-20 pt-8 md:pt-10 flex flex-col gap-8 md:gap-14 bg-white dark:bg-baseInk">
				<div className="container relative z-10 mx-auto px-4 sm:px-7">
					<div className='flex flex-col gap-8 md:gap-14'>
						<div className="flex flex-col items-center gap-2">
							<h1 className="font-semibold text-2xl md:text-4xl">
								Chính sách Bảo mật
							</h1>
							<p className="text-navyGray dark:text-white/80 text-sm md:text-base">
								Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
							</p>
						</div>
						<div className="text-justify max-w-4xl mx-auto prose prose-lg dark:prose-invert">
							<div className="space-y-6 text-navyGray dark:text-white/80">
								<div>
									<h2 className="font-semibold text-xl mb-4">1. Giới thiệu</h2>
									<p>
										<strong>Nguyễn Hữu Phước</strong> ("chúng tôi", "chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách Bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ, và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng website <strong>nguyenhuuphuoc.com</strong> và các dịch vụ liên quan (sau đây gọi là "Dịch vụ").
									</p>
									<p className="mt-4">
										Bằng cách sử dụng Dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và sử dụng thông tin theo Chính sách Bảo mật này. Nếu bạn không đồng ý với chính sách này, vui lòng không sử dụng Dịch vụ của chúng tôi.
									</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">2. Thông tin chúng tôi thu thập</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">2.1 Thông tin bạn cung cấp trực tiếp</h3>
											<p>Chúng tôi có thể thu thập các thông tin sau khi bạn tương tác với Dịch vụ:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li><strong>Thông tin tài khoản:</strong> Tên, địa chỉ email, mật khẩu (được mã hóa), và các thông tin khác khi bạn đăng ký tài khoản.</li>
												<li><strong>Thông tin liên hệ:</strong> Tên, địa chỉ email, số điện thoại, địa chỉ khi bạn điền form liên hệ hoặc đăng ký tư vấn.</li>
												<li><strong>Thông tin thanh toán:</strong> Thông tin chuyển khoản ngân hàng (chúng tôi không lưu trữ thông tin thẻ tín dụng hoặc thông tin tài chính nhạy cảm khác).</li>
												<li><strong>Nội dung người dùng:</strong> Bình luận, đánh giá, câu hỏi, hoặc nội dung khác mà bạn đăng tải trên website.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">2.2 Thông tin tự động thu thập</h3>
											<p>Khi bạn truy cập website, chúng tôi có thể tự động thu thập:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li><strong>Thông tin thiết bị:</strong> Loại thiết bị, hệ điều hành, trình duyệt, địa chỉ IP.</li>
												<li><strong>Thông tin sử dụng:</strong> Trang bạn truy cập, thời gian truy cập, liên kết bạn click, thời gian bạn ở lại trên trang.</li>
												<li><strong>Cookies và công nghệ tương tự:</strong> Chúng tôi sử dụng cookies và các công nghệ theo dõi tương tự để cải thiện trải nghiệm của bạn.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">2.3 Thông tin từ bên thứ ba</h3>
											<p>Chúng tôi có thể nhận thông tin về bạn từ các dịch vụ bên thứ ba khi bạn đăng nhập bằng tài khoản Google hoặc các dịch vụ OAuth khác.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">3.1 Cung cấp và cải thiện Dịch vụ</h3>
											<ul className="list-disc ml-6 space-y-1">
												<li>Cung cấp, duy trì, và cải thiện Dịch vụ của chúng tôi.</li>
												<li>Xử lý các yêu cầu, đơn hàng, và giao dịch của bạn.</li>
												<li>Gửi thông báo về Dịch vụ, cập nhật, và thay đổi.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">3.2 Giao tiếp</h3>
											<ul className="list-disc ml-6 space-y-1">
												<li>Trả lời các câu hỏi và yêu cầu hỗ trợ của bạn.</li>
												<li>Gửi email xác thực, thông báo quan trọng, và cập nhật về Dịch vụ.</li>
												<li>Gửi thông tin marketing (chỉ khi bạn đã đồng ý).</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">3.3 Bảo mật và tuân thủ pháp luật</h3>
											<ul className="list-disc ml-6 space-y-1">
												<li>Phát hiện, ngăn chặn, và giải quyết các vấn đề bảo mật, gian lận, hoặc vi phạm.</li>
												<li>Tuân thủ các nghĩa vụ pháp lý và quy định hiện hành.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">3.4 Phân tích và nghiên cứu</h3>
											<ul className="list-disc ml-6 space-y-1">
												<li>Phân tích cách người dùng sử dụng Dịch vụ để cải thiện trải nghiệm.</li>
												<li>Tiến hành nghiên cứu và phân tích dữ liệu tổng hợp (không nhận dạng cá nhân).</li>
											</ul>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">4. Chia sẻ thông tin</h2>
									<p>Chúng tôi không bán, cho thuê, hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, ngoại trừ các trường hợp sau:</p>
									<div className="space-y-4 mt-4">
										<div>
											<h3 className="font-semibold mb-2">4.1 Nhà cung cấp dịch vụ</h3>
											<p>Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ bên thứ ba để:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li>Lưu trữ dữ liệu (ví dụ: MongoDB Atlas, Cloudinary).</li>
												<li>Gửi email (ví dụ: Nodemailer với Zoho Mail hoặc Gmail).</li>
												<li>Phân tích dữ liệu (ví dụ: Google Analytics).</li>
												<li>Xử lý thanh toán (nếu có).</li>
											</ul>
											<p className="mt-2">Các nhà cung cấp này chỉ được phép sử dụng thông tin để cung cấp dịch vụ cho chúng tôi và phải tuân thủ các cam kết bảo mật.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">4.2 Yêu cầu pháp lý</h3>
											<p>Chúng tôi có thể tiết lộ thông tin nếu được yêu cầu bởi pháp luật, quy định, hoặc quy trình pháp lý, hoặc để bảo vệ quyền, tài sản, hoặc an toàn của chúng tôi hoặc người khác.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">4.3 Với sự đồng ý của bạn</h3>
											<p>Chúng tôi có thể chia sẻ thông tin với sự đồng ý rõ ràng của bạn.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">5. Cookies và công nghệ theo dõi</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">5.1 Cookies là gì?</h3>
											<p>Cookies là các file văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. Chúng giúp website ghi nhớ các tùy chọn của bạn và cải thiện trải nghiệm.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">5.2 Các loại Cookies chúng tôi sử dụng</h3>
											<ul className="list-disc ml-6 space-y-1">
												<li><strong>Cookies cần thiết:</strong> Cần thiết để website hoạt động, ví dụ: xác thực đăng nhập, giỏ hàng.</li>
												<li><strong>Cookies phân tích:</strong> Giúp chúng tôi hiểu cách người dùng sử dụng website (ví dụ: Google Analytics).</li>
												<li><strong>Cookies quảng cáo:</strong> Được sử dụng để hiển thị quảng cáo phù hợp (ví dụ: Google AdSense).</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">5.3 Quản lý Cookies</h3>
											<p>Bạn có thể kiểm soát và quản lý cookies thông qua cài đặt trình duyệt của bạn. Tuy nhiên, việc tắt cookies có thể ảnh hưởng đến chức năng của website.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">6. Bảo mật thông tin</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">6.1 Biện pháp bảo mật</h3>
											<p>Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li>Mã hóa dữ liệu nhạy cảm (ví dụ: mật khẩu được hash bằng bcrypt).</li>
												<li>Sử dụng HTTPS để mã hóa dữ liệu truyền tải.</li>
												<li>Giới hạn quyền truy cập thông tin chỉ cho những người cần thiết.</li>
												<li>Cập nhật và bảo trì hệ thống bảo mật thường xuyên.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">6.2 Giới hạn bảo mật</h3>
											<p>Mặc dù chúng tôi nỗ lực bảo vệ thông tin của bạn, không có phương pháp truyền tải hoặc lưu trữ nào là 100% an toàn. Bạn sử dụng Dịch vụ là do bạn tự chịu rủi ro.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">7. Quyền của bạn</h2>
									<p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
									<div className="space-y-3 mt-4">
										<div>
											<h3 className="font-semibold mb-1">7.1 Quyền truy cập</h3>
											<p>Bạn có quyền yêu cầu truy cập thông tin cá nhân mà chúng tôi lưu trữ về bạn.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-1">7.2 Quyền chỉnh sửa</h3>
											<p>Bạn có quyền yêu cầu chỉnh sửa hoặc cập nhật thông tin cá nhân không chính xác.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-1">7.3 Quyền xóa</h3>
											<p>Bạn có quyền yêu cầu xóa thông tin cá nhân của bạn, trừ khi chúng tôi có nghĩa vụ pháp lý phải lưu trữ.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-1">7.4 Quyền từ chối</h3>
											<p>Bạn có quyền từ chối việc xử lý thông tin cá nhân của bạn cho mục đích marketing.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-1">7.5 Quyền rút lại đồng ý</h3>
											<p>Bạn có quyền rút lại đồng ý của bạn về việc xử lý thông tin cá nhân bất cứ lúc nào.</p>
										</div>
									</div>
									<p className="mt-4">
										Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: <strong>{siteMetadata.owner_email}</strong>
									</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">8. Lưu trữ thông tin</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">8.1 Thời gian lưu trữ</h3>
											<p>Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để cung cấp Dịch vụ và tuân thủ các nghĩa vụ pháp lý, trừ khi bạn yêu cầu xóa sớm hơn.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">8.2 Xóa thông tin</h3>
											<p>Khi thông tin không còn cần thiết, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin đó một cách an toàn.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">9. Trẻ em</h2>
									<p>Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn là phụ huynh hoặc người giám hộ và biết rằng con bạn đã cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ với chúng tôi.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">10. Liên kết đến website khác</h2>
									<p>Website của chúng tôi có thể chứa các liên kết đến website của bên thứ ba. Chúng tôi không chịu trách nhiệm về chính sách bảo mật hoặc thực hành của các website đó. Chúng tôi khuyến khích bạn đọc chính sách bảo mật của các website đó.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">11. Thay đổi Chính sách Bảo mật</h2>
									<p>Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính sách Bảo mật mới trên trang này và cập nhật ngày "Cập nhật lần cuối" ở đầu trang.</p>
									<p className="mt-4">Việc bạn tiếp tục sử dụng Dịch vụ sau khi có thay đổi được coi là bạn đã chấp nhận Chính sách Bảo mật mới.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">12. Liên hệ</h2>
									<p>Nếu bạn có bất kỳ câu hỏi, yêu cầu, hoặc khiếu nại nào về Chính sách Bảo mật này hoặc cách chúng tôi xử lý thông tin cá nhân của bạn, vui lòng liên hệ với chúng tôi:</p>
									<div className="mt-4 space-y-1">
										<p><strong>Nguyễn Hữu Phước</strong></p>
										<p>Địa chỉ: Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam</p>
										<p>Email: {siteMetadata.owner_email}</p>
										<p>Website: <a href="https://www.nguyenhuuphuoc.com/lien-he" className="text-primary hover:underline">https://www.nguyenhuuphuoc.com/lien-he</a></p>
										<p>Điện thoại: {siteMetadata.phone}</p>
									</div>
									<p className="mt-4">Chúng tôi sẽ cố gắng phản hồi các yêu cầu của bạn trong vòng 30 ngày.</p>
								</div>

								<div className="mt-8 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
									<p className="font-semibold">Lưu ý:</p>
									<p className="mt-2">Bằng cách sử dụng Dịch vụ của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu, và đồng ý với Chính sách Bảo mật này.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

