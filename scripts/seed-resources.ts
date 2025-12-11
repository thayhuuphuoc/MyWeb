import prisma from "../lib/prisma";
import { defaultResourceSections } from "../actions/resources/validations";

async function seedResources() {
	console.log("🌱 Bắt đầu khởi tạo Resource Sections...");

	try {
		for (const section of defaultResourceSections) {
			const existing = await prisma.resourceSection.findUnique({
				where: { sectionId: section.sectionId },
			});

			if (existing) {
				console.log(`⏭️  Section "${section.title}" đã tồn tại, bỏ qua...`);
				continue;
			}

			await prisma.resourceSection.create({
				data: section,
			});

			console.log(`✅ Đã tạo section: ${section.title}`);
		}

		console.log("🎉 Hoàn thành khởi tạo Resource Sections!");
	} catch (error) {
		console.error("❌ Lỗi khi khởi tạo:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Chạy script
if (require.main === module) {
	seedResources()
		.then(() => {
			process.exit(0);
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}

export default seedResources;

