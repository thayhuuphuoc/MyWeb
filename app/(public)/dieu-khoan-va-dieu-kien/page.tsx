import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
	title: "Điều khoản & Điều kiện",
	description: `Điều khoản & Điều kiện sử dụng website ${siteMetadata.logoTitle}`,
};

export default function TermsAndConditionsPage() {
	return (
		<section>
			<div className="pb-16 md:pb-20 pt-8 md:pt-10 flex flex-col gap-8 md:gap-14 bg-white dark:bg-baseInk">
				<div className="container relative z-10 mx-auto px-4 sm:px-7">
					<div className='flex flex-col gap-8 md:gap-14'>
						<div className="flex flex-col items-center gap-2">
							<h1 className="font-semibold text-2xl md:text-4xl">
								Điều khoản & Điều kiện
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
										Chào mừng bạn đến với website của <strong>Nguyễn Hữu Phước</strong> (sau đây gọi là "chúng tôi", "chúng tôi", "của chúng tôi"). Website này được vận hành tại địa chỉ <strong>nguyenhuuphuoc.com</strong> và các tên miền phụ liên quan.
									</p>
									<p className="mt-4">
										Bằng cách truy cập và sử dụng website này, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản & Điều kiện sử dụng sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng website của chúng tôi.
									</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">2. Định nghĩa</h2>
									<ul className="space-y-4 list-none">
										<li>
											<p><strong>2.1 "Website"</strong> - Chỉ website được vận hành tại nguyenhuuphuoc.com và các tên miền phụ liên quan.</p>
										</li>
										<li>
											<p><strong>2.2 "Nội dung"</strong> - Bao gồm tất cả các bài viết, hình ảnh, video, tài liệu, mã nguồn, tài nguyên học tập, và bất kỳ thông tin nào khác được đăng tải trên website.</p>
										</li>
										<li>
											<p><strong>2.3 "Dịch vụ"</strong> - Bao gồm các dịch vụ lập trình, thiết kế website, tư vấn kỹ thuật, đào tạo, và các dịch vụ liên quan được cung cấp thông qua website.</p>
										</li>
										<li>
											<p><strong>2.4 "Người dùng"</strong> - Bất kỳ cá nhân hoặc tổ chức nào truy cập hoặc sử dụng website này.</p>
										</li>
										<li>
											<p><strong>2.5 "Tài khoản"</strong> - Tài khoản được tạo bởi người dùng để truy cập các tính năng đặc biệt của website.</p>
										</li>
									</ul>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">3. Quyền sử dụng</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">3.1 Quyền truy cập</h3>
											<p>Chúng tôi cấp cho bạn quyền truy cập và sử dụng website cho mục đích cá nhân, phi thương mại, phù hợp với các điều khoản này.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">3.2 Hạn chế sử dụng</h3>
											<p>Bạn không được phép:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li>Sao chép, phân phối, hoặc sử dụng lại nội dung của website cho mục đích thương mại mà không có sự cho phép bằng văn bản của chúng tôi.</li>
												<li>Sử dụng nội dung của website để tạo ra các sản phẩm cạnh tranh trực tiếp.</li>
												<li>Xóa hoặc thay đổi bất kỳ thông báo bản quyền, nhãn hiệu, hoặc các thông tin sở hữu trí tuệ khác.</li>
												<li>Sử dụng website theo cách vi phạm pháp luật hoặc quy định hiện hành.</li>
											</ul>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">4. Sở hữu trí tuệ</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">4.1 Bản quyền</h3>
											<p>Tất cả nội dung trên website, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, video, mã nguồn, thiết kế, và logo, đều thuộc bản quyền của <strong>Nguyễn Hữu Phước</strong> hoặc các bên cấp phép của chúng tôi, và được bảo vệ bởi luật bản quyền Việt Nam và các điều ước quốc tế.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">4.2 Nhãn hiệu</h3>
											<p>Tên "Nguyễn Hữu Phước", "nguyenhuuphuoc.com", và các logo, nhãn hiệu khác được hiển thị trên website là tài sản của chúng tôi hoặc các bên cấp phép của chúng tôi.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">4.3 Nội dung của người dùng</h3>
											<p>Khi bạn đăng tải, gửi, hoặc chia sẻ nội dung trên website (ví dụ: bình luận, đánh giá), bạn cấp cho chúng tôi quyền không độc quyền, miễn phí, có thể chuyển nhượng để sử dụng, sao chép, chỉnh sửa, và hiển thị nội dung đó trên website và các nền tảng liên quan.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">5. Dịch vụ và sản phẩm</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">5.1 Mô tả dịch vụ</h3>
											<p>Chúng tôi cung cấp các dịch vụ lập trình, thiết kế website, tư vấn kỹ thuật, đào tạo, và các dịch vụ liên quan. Mô tả dịch vụ trên website chỉ mang tính chất tham khảo và có thể được cập nhật mà không cần thông báo trước.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">5.2 Đặt hàng và thanh toán</h3>
											<ul className="list-disc ml-6 space-y-1">
												<li>Việc đặt hàng dịch vụ được xác nhận khi chúng tôi nhận được thanh toán hoặc xác nhận từ bạn.</li>
												<li>Giá cả có thể thay đổi mà không cần thông báo trước, nhưng sẽ không ảnh hưởng đến các đơn hàng đã được xác nhận.</li>
												<li>Thanh toán được thực hiện qua chuyển khoản ngân hàng hoặc các phương thức khác được thỏa thuận.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">5.3 Hoàn tiền</h3>
											<p>Chính sách hoàn tiền sẽ được thỏa thuận riêng cho từng dự án và được ghi rõ trong hợp đồng hoặc thỏa thuận dịch vụ.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">6. Tài khoản người dùng</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">6.1 Đăng ký tài khoản</h3>
											<p>Để sử dụng một số tính năng của website, bạn có thể cần tạo tài khoản. Bạn cam kết:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li>Cung cấp thông tin chính xác, đầy đủ, và cập nhật.</li>
												<li>Duy trì và bảo mật thông tin đăng nhập của bạn.</li>
												<li>Chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">6.2 Bảo mật tài khoản</h3>
											<p>Bạn không được phép chia sẻ thông tin đăng nhập của mình với bất kỳ ai. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc bạn không tuân thủ quy định này.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">6.3 Đình chỉ tài khoản</h3>
											<p>Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu bạn vi phạm các điều khoản này hoặc có hành vi không phù hợp.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">7. Bình luận và tương tác</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">7.1 Quy tắc bình luận</h3>
											<p>Khi bình luận hoặc tương tác trên website, bạn cam kết:</p>
											<ul className="list-disc ml-6 mt-2 space-y-1">
												<li>Tôn trọng người khác và không sử dụng ngôn ngữ thô tục, xúc phạm, hoặc phân biệt đối xử.</li>
												<li>Không đăng tải nội dung vi phạm pháp luật, bản quyền, hoặc quyền riêng tư của người khác.</li>
												<li>Không spam, quảng cáo, hoặc đăng tải nội dung không liên quan.</li>
											</ul>
										</div>
										<div>
											<h3 className="font-semibold mb-2">7.2 Kiểm duyệt</h3>
											<p>Chúng tôi có quyền kiểm duyệt, chỉnh sửa, hoặc xóa bất kỳ bình luận hoặc nội dung nào mà chúng tôi cho là không phù hợp.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">8. Liên kết đến website khác</h2>
									<p>Website của chúng tôi có thể chứa các liên kết đến website của bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung, chính sách bảo mật, hoặc thực hành của các website đó. Việc bạn truy cập các website đó là do bạn tự chịu rủi ro.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">9. Từ chối trách nhiệm</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">9.1 Thông tin</h3>
											<p>Mặc dù chúng tôi nỗ lực cung cấp thông tin chính xác và cập nhật, chúng tôi không đảm bảo rằng tất cả thông tin trên website là hoàn toàn chính xác, đầy đủ, hoặc phù hợp với mục đích của bạn.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">9.2 Dịch vụ</h3>
											<p>Chúng tôi không đảm bảo rằng website sẽ luôn hoạt động không bị gián đoạn, không có lỗi, hoặc an toàn. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng website.</p>
										</div>
										<div>
											<h3 className="font-semibold mb-2">9.3 Nội dung của bên thứ ba</h3>
											<p>Chúng tôi không chịu trách nhiệm về nội dung, sản phẩm, hoặc dịch vụ của bên thứ ba được đề cập hoặc liên kết trên website.</p>
										</div>
									</div>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">10. Giới hạn trách nhiệm</h2>
									<p>Trong phạm vi tối đa được pháp luật cho phép, chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt, hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng website, bao gồm nhưng không giới hạn ở mất lợi nhuận, mất dữ liệu, hoặc gián đoạn kinh doanh.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">11. Bồi thường</h2>
									<p>Bạn đồng ý bồi thường và giữ cho chúng tôi không bị thiệt hại từ bất kỳ khiếu nại, yêu cầu, thiệt hại, trách nhiệm pháp lý, chi phí, và phí tổn (bao gồm phí luật sư) phát sinh từ:</p>
									<ul className="list-disc ml-6 mt-2 space-y-1">
										<li>Việc bạn vi phạm các điều khoản này.</li>
										<li>Việc bạn vi phạm quyền của bên thứ ba.</li>
										<li>Việc bạn sử dụng website một cách không phù hợp.</li>
									</ul>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">12. Thay đổi điều khoản</h2>
									<p>Chúng tôi có quyền cập nhật, sửa đổi, hoặc thay thế các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc bạn tiếp tục sử dụng website sau khi có thay đổi được coi là bạn đã chấp nhận các điều khoản mới.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">13. Chấm dứt</h2>
									<p>Chúng tôi có quyền chấm dứt hoặc đình chỉ quyền truy cập của bạn vào website, mà không cần thông báo trước, nếu bạn vi phạm các điều khoản này.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">14. Luật áp dụng</h2>
									<p>Các điều khoản này được điều chỉnh bởi và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Thành phố Hồ Chí Minh, Việt Nam.</p>
								</div>

								<div>
									<h2 className="font-semibold text-xl mb-4">15. Liên hệ</h2>
									<p>Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản & Điều kiện này, vui lòng liên hệ với chúng tôi:</p>
									<div className="mt-4 space-y-1">
										<p><strong>Nguyễn Hữu Phước</strong></p>
										<p>Địa chỉ: Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam</p>
										<p>Email: {siteMetadata.owner_email}</p>
										<p>Website: <a href="https://www.nguyenhuuphuoc.com/lien-he" className="text-primary hover:underline">https://www.nguyenhuuphuoc.com/lien-he</a></p>
										<p>Điện thoại: {siteMetadata.phone}</p>
									</div>
								</div>

								<div className="mt-8 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
									<p className="font-semibold">Lưu ý:</p>
									<p className="mt-2">Bằng cách sử dụng website này, bạn xác nhận rằng bạn đã đọc, hiểu, và đồng ý tuân thủ các Điều khoản & Điều kiện sử dụng này.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

